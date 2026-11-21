import { withSupportMailbox } from "./supportMailbox";
import { getPool } from "@workspace/db";
import { staffEmail } from "./supportAuth";
import { EmailSyncInProgressError, syncEmailInbox, syncLocalInbox } from "./supportInbox";

function plain(part:any):string {
  if(part?.mimeType==="text/plain" && part.body?.data)return Buffer.from(part.body.data,"base64url").toString("utf8");
  return (part?.parts??[]).map(plain).filter(Boolean).join("\n");
}
export async function importSupportReplies() {
  return withSupportMailbox(staffEmail, async gmail => {
  const profile=await gmail("/gmail/v1/users/me/profile");
  if(profile.emailAddress?.toLowerCase()!==staffEmail)throw new Error("Wrong support mailbox connected");
  let imported=0;
  let page:string|undefined;
  // Bounded catch-up, oldest already imported messages are deduplicated by provider id.
  for(let batch=0;batch<10;batch++) {
    const list=await gmail(`/gmail/v1/users/me/messages?maxResults=50&q=${encodeURIComponent(`in:sent from:${staffEmail} subject:NZ- newer_than:90d`)}${page?`&pageToken=${encodeURIComponent(page)}`:""}`);
    for(const item of list.messages??[]) {
      const key=`gmail:${item.id}`;
      if((await getPool().query("SELECT 1 FROM support_cases WHERE source_id=$1",[key])).rowCount)continue;
      const message=await gmail(`/gmail/v1/users/me/messages/${encodeURIComponent(item.id)}?format=full`);
      if (!message) continue;
      const headers=message.payload?.headers??[];
      const subject=headers.find((h:any)=>h.name.toLowerCase()==="subject")?.value??"";
      const from=headers.find((h:any)=>h.name.toLowerCase()==="from")?.value??"";
      const reply=headers.find((h:any)=>h.name.toLowerCase()==="in-reply-to")?.value;
      if(!reply || !from.toLowerCase().includes(staffEmail) || !/NZ-[A-Z0-9]+/i.test(subject))continue;
      const body=plain(message.payload).split(/\nOn .+wrote:|\n_{5,}|\n-{5,}/)[0].slice(0,10000).trim();
      if(!body)continue;
      // Import as unverified diagnostic draft, never a confirmed resolution.
      const result=await getPool().query(`INSERT INTO support_cases(title,diagnostic_questions,source,source_id) VALUES($1,$2,'email',$3) ON CONFLICT(source_id) DO NOTHING`,[subject.slice(0,200),body,key]);
      imported+=result.rowCount??0;
    }
    page=list.nextPageToken;if(!page)break;
  }
  return imported;
  });
}

export function startSupportImportWorker(onError:(error:unknown)=>void) {
  let running=false;
  const run=async()=>{
    if(running)return;
    running=true;
    try {
      await syncLocalInbox();
      await syncEmailInbox();
    } catch(error){
      if(!(error instanceof EmailSyncInProgressError))onError(error);
    } finally{running=false;}
  };
  const timer=setInterval(()=>void run(),5*60*1000);
  timer.unref();
}