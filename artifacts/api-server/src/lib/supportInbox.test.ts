import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventEmitter } from "node:events";

const mocks=vi.hoisted(()=>({
  connect:vi.fn(), query:vi.fn(), proxy:vi.fn(), classify:vi.fn(),
}));
vi.mock("@workspace/db",()=>({getPool:()=>({connect:mocks.connect,query:mocks.query})}));
vi.mock("@replit/connectors-sdk",()=>({ReplitConnectors:class {proxy=mocks.proxy;}}));
vi.mock("./supportAuth",()=>({staffEmail:"support@example.test"}));
vi.mock("@workspace/integrations-openai-ai-server",()=>({
  openai:{chat:{completions:{create:mocks.classify}}},
}));
import { EmailSyncInProgressError, syncEmailInbox } from "./supportInbox";
import { startSupportImportWorker } from "./supportImport";

let owner:object|null;
let clients:(EventEmitter & {query:ReturnType<typeof vi.fn>;release:ReturnType<typeof vi.fn>})[];
function deferred(){
  let resolve!:()=>void;
  const promise=new Promise<void>(r=>{resolve=r;});
  return {promise,resolve};
}
beforeEach(()=>{
  vi.stubEnv("SUPPORT_MAIL_PROVIDER","replit");
  vi.resetAllMocks();
  owner=null;
  clients=[];
  // Separate clients emulate independent processes sharing one database lock.
  mocks.connect.mockImplementation(async()=>{
    const client=Object.assign(new EventEmitter(),{
      query:vi.fn(async(sql:string)=>{
        if(sql==="BEGIN")return {rows:[]};
        if(sql.startsWith("SET LOCAL"))return {rows:[]};
        if(sql.includes("pg_try_advisory_xact_lock")){
          const locked=owner===null;
          if(locked)owner=client;
          return {rows:[{locked}]};
        }
        if(sql==="ROLLBACK"){
          if(owner===client)owner=null;
          return {rows:[]};
        }
        throw new Error("Unexpected lock query");
      }),
      release:vi.fn((discard:boolean)=>{if(discard&&owner===client)owner=null;}),
    });
    clients.push(client);
    return client;
  });
  mocks.query.mockResolvedValue({rows:[],rowCount:0});
  mocks.proxy.mockImplementation(async(_provider:string,path:string)=>({
    ok:true,
    json:async()=>path.endsWith("/profile")?{emailAddress:"support@example.test"}:{threads:[]},
  }));
});
afterEach(()=>{vi.clearAllTimers();vi.useRealTimers();vi.unstubAllEnvs();});

describe("shared email import lock (no external services)",()=>{
  it("aborts classification and prevents late writes after losing the lock",async()=>{
    const entered=deferred(),finish=deferred();
    mocks.proxy.mockImplementation(async(_provider:string,path:string)=>({
      ok:true,json:async()=>path.endsWith("/profile")?{emailAddress:"support@example.test"}:
        path.includes("?maxResults")?{threads:[{id:"synthetic"}]}:
        {historyId:"1",messages:[{id:"1",payload:{headers:[]},snippet:"Synthetic question"}]},
    }));
    mocks.classify.mockImplementationOnce(async()=>{
      entered.resolve();await finish.promise;
      return {choices:[{message:{content:'{"relevant":true}'}}]};
    });
    const run=syncEmailInbox();
    const assertion=expect(run).rejects.toThrow("Connection lost");
    await entered.promise;
    clients[0].emit("error",new Error("Connection lost"));
    await assertion;
    expect(mocks.classify.mock.calls[0][1].signal.aborted).toBe(true);
    finish.resolve();
    await new Promise(resolve=>setImmediate(resolve));
    expect(mocks.query.mock.calls.some(([sql])=>sql.startsWith("INSERT"))).toBe(false);
    expect(()=>clients[0].emit("error",new Error("Late socket error"))).not.toThrow();
  });
  it.each(["disconnect","deadline"])("stops paused mailbox work safely after %s",async(reason)=>{
    vi.useFakeTimers();
    const entered=deferred(),finish=deferred();
    mocks.proxy.mockImplementationOnce(async()=>{
      entered.resolve();await finish.promise;
      return {ok:true,json:async()=>({emailAddress:"support@example.test"})};
    });
    const run=syncEmailInbox();
    const assertion=expect(run).rejects.toThrow(reason==="disconnect"?"idle-in-transaction":"ten-minute");
    await entered.promise;
    expect(clients[0].query).toHaveBeenCalledWith("SET LOCAL idle_in_transaction_session_timeout = 0");
    if(reason==="disconnect")clients[0].emit("error",new Error("idle-in-transaction timeout"));
    else await vi.advanceTimersByTimeAsync(600000);
    await assertion;
    expect(clients[0].release).toHaveBeenCalledWith(true);
    finish.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(mocks.proxy).toHaveBeenCalledTimes(1);
    expect(mocks.query).not.toHaveBeenCalled();
    await expect(syncEmailInbox()).resolves.toBe(0);
  });
  it("rejects competing clients before mailbox access and preserves the owner's lock",async()=>{
    const entered=deferred(),finish=deferred();
    mocks.proxy.mockImplementationOnce(async()=>{
      entered.resolve();await finish.promise;
      return {ok:true,json:async()=>({emailAddress:"support@example.test"})};
    });
    const first=syncEmailInbox();
    await entered.promise;
    try{
      await expect(syncEmailInbox()).rejects.toBeInstanceOf(EmailSyncInProgressError);
      await expect(syncEmailInbox()).rejects.toBeInstanceOf(EmailSyncInProgressError);
      expect(mocks.proxy).toHaveBeenCalledTimes(1);
      expect(owner).toBe(clients[0]);
      expect(clients[1].release).toHaveBeenCalledWith(false);
    }finally{finish.resolve();}
    await expect(first).resolves.toBe(0);
    expect(owner).toBeNull();
    await expect(syncEmailInbox()).resolves.toBe(0);
    expect(clients[0].query).toHaveBeenLastCalledWith("ROLLBACK");
    expect(clients[0].release).toHaveBeenCalledWith(false);
  });

  it.each(["mailbox","classification","write"] as const)("releases after %s failure and permits retry",async(phase)=>{
    const failure=new Error("Synthetic import failure");
    if(phase==="mailbox")mocks.proxy.mockRejectedValueOnce(failure);
    else{
      mocks.proxy.mockImplementation(async(_provider:string,path:string)=>({
        ok:true,json:async()=>{
          if(path.endsWith("/profile"))return {emailAddress:"support@example.test"};
          if(path.includes("?maxResults"))return {threads:[{id:"synthetic"}]};
          return {historyId:"1",messages:[{id:"1",payload:{headers:[]},snippet:"Synthetic question"}]};
        },
      }));
      if(phase==="classification")mocks.classify.mockRejectedValueOnce(failure);
      else{
        mocks.classify.mockResolvedValue({choices:[{message:{content:'{"relevant":true}'}}]});
        mocks.query.mockImplementation(async(sql:string)=>{
          if(sql.startsWith("INSERT"))throw failure;
          return {rows:[],rowCount:0};
        });
      }
    }
    await expect(syncEmailInbox()).rejects.toBe(failure);
    expect(owner).toBeNull();
    expect(clients[0].release).toHaveBeenCalledWith(false);
    mocks.proxy.mockImplementation(async(_provider:string,path:string)=>({
      ok:true,json:async()=>path.endsWith("/profile")?{emailAddress:"support@example.test"}:{threads:[]},
    }));
    await expect(syncEmailInbox()).resolves.toBe(0);
  });

  it("destroys the connection if lock cleanup fails",async()=>{
    const entered=deferred(),finish=deferred();
    mocks.proxy.mockImplementationOnce(async()=>{
      entered.resolve();await finish.promise;
      return {ok:true,json:async()=>({emailAddress:"support@example.test"})};
    });
    const run=syncEmailInbox();
    await entered.promise;
    clients[0].query.mockRejectedValueOnce(new Error("Rollback failed"));
    const assertion=expect(run).rejects.toThrow("Rollback failed");
    finish.resolve();
    await assertion;
    expect(clients[0].release).toHaveBeenCalledWith(true);
    await expect(syncEmailInbox()).resolves.toBe(0);
  });

  it("does not contact email when acquisition fails and releases the client",async()=>{
    const connect=mocks.connect.getMockImplementation()!;
    mocks.connect.mockImplementationOnce(async()=>{
      const client=await connect();
      client.query.mockRejectedValueOnce(new Error("Begin failed"));
      return client;
    });
    await expect(syncEmailInbox()).rejects.toThrow("Begin failed");
    expect(mocks.proxy).not.toHaveBeenCalled();
    expect(clients[0].release).toHaveBeenCalledWith(false);
    await expect(syncEmailInbox()).resolves.toBe(0);
  });

  it.each(["scheduled","manual"] as const)("coordinates %s owner with the other entry point",async(first)=>{
    vi.useFakeTimers();
    const onError=vi.fn(),entered=deferred(),finish=deferred();
    mocks.proxy.mockImplementationOnce(async()=>{
      entered.resolve();await finish.promise;
      return {ok:true,json:async()=>({emailAddress:"support@example.test"})};
    });
    startSupportImportWorker(onError);
    if(first==="scheduled"){
      await vi.advanceTimersByTimeAsync(5*60*1000);
      await entered.promise;
      await expect(syncEmailInbox()).rejects.toBeInstanceOf(EmailSyncInProgressError);
      finish.resolve();
    }else{
      const manual=syncEmailInbox();
      await entered.promise;
      await vi.advanceTimersByTimeAsync(5*60*1000);
      expect(mocks.proxy).toHaveBeenCalledTimes(1);
      finish.resolve();
      await manual;
    }
    await vi.advanceTimersByTimeAsync(5*60*1000);
    expect(onError).not.toHaveBeenCalled();
    expect(owner).toBeNull();
    expect(clients.length).toBeGreaterThanOrEqual(3);
  });

  it("allows the scheduler to retry after an import error",async()=>{
    vi.useFakeTimers();
    const onError=vi.fn();
    mocks.proxy.mockRejectedValueOnce(new Error("Synthetic mailbox failure"));
    startSupportImportWorker(onError);
    await vi.advanceTimersByTimeAsync(5*60*1000);
    expect(onError).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(5*60*1000);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(owner).toBeNull();
    expect(clients).toHaveLength(2);
  });
});
