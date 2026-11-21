import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import pg from "pg";

// Never consume DATABASE_URL, PG*, or any application credentials.
const childEnv = { PATH: process.env.PATH, LANG: "C", HOME: tmpdir() };
export function hasBinary(name: string) {
  try {
    execFileSync(name, ["--version"], { env: childEnv, stdio: "ignore" });
    return true;
  } catch { return false; }
}

export function isolatedPostgres() {
  for (const bin of ["initdb", "pg_ctl"]) {
    if (!hasBinary(bin)) throw new Error(`Install PostgreSQL (${bin}) to run inbox integration tests`);
  }
  const root = mkdtempSync(join(tmpdir(), "inbox-pg-"));
  const data = join(root, "data");
  let started = false;
  let bouncer = false;
  const run = (bin: string, args: string[]) =>
    execFileSync(bin, args, { env: childEnv, timeout: 30_000, stdio: "pipe" });
  const stop = () => {
    if (bouncer) {
      // This pid file belongs only to the process launched in this private directory.
      try { run("pkill", ["-F", join(root, "bouncer.pid")]); } catch { /* already stopped */ }
    }
    if (started) run("pg_ctl", ["-D", data, "-m", "immediate", "-w", "stop"]);
    rmSync(root, { recursive: true, force: true });
  };
  try {
    run("initdb", ["-D", data, "-U", "inbox_test", "-A", "trust", "--no-locale"]);
    // Private Unix socket only: no TCP listener or access to any existing server.
    run("pg_ctl", ["-D", data, "-l", join(root, "postgres.log"),
      "-o", `-k ${root} -h '' -p 5432`, "-w", "start"]);
    started = true;
    if (hasBinary("pgbouncer")) {
      writeFileSync(join(root, "users.txt"), '"inbox_test" ""\n', { mode: 0o600 });
      writeFileSync(join(root, "bouncer.ini"), `[databases]
postgres = host=${root} port=5432 dbname=postgres
[pgbouncer]
listen_addr =
listen_port = 6543
unix_socket_dir = ${root}
auth_type = trust
auth_file = ${root}/users.txt
pool_mode = transaction
default_pool_size = 4
max_client_conn = 20
pidfile = ${root}/bouncer.pid
logfile = ${root}/bouncer.log
`);
      run("pgbouncer", ["-d", join(root, "bouncer.ini")]);
      bouncer = true;
    }
    return {
      data, bouncer, stop,
      pool(pooled = false) {
        if (pooled && !bouncer) throw new Error("PgBouncer is unavailable");
        return new pg.Pool({
          host: root, port: pooled ? 6543 : 5432, user: "inbox_test",
          database: "postgres", password: "", ssl: false, max: 4,
          connectionTimeoutMillis: 3000, query_timeout: 3000,
        });
      },
    };
  } catch (error) {
    stop();
    throw error;
  }
}
