# Email import PostgreSQL integration tests

Run `pnpm --filter @workspace/api-server run test:inbox-postgres`.

Requires `initdb` and `pg_ctl` on PATH, running as a non-root user. If
`pgbouncer` is available, the same cases also run through a real transaction-mode
pooler. Without it, those cases are explicitly skipped; missing PostgreSQL fails
the command. PgBouncer is included in the workspace's Nix packages.

## Safety

The fixture initializes a fresh cluster in a unique private temporary directory,
listens only on its Unix socket, and verifies the server data-directory identity,
test role, and empty public schema before testing. It never reads DATABASE_URL,
PG connection settings, or production credentials. Child processes receive only
PATH, LANG, and a temporary HOME. No application migrations or customer records
are involved. Teardown closes the pools, stops the temporary servers, and removes
their files. If the test runner is forcibly killed, temporary files/processes may
need manual cleanup; never target a server outside that run's `inbox-pg-*` directory.

The suite calls the production `syncEmailInbox` function. Only the pool provider
and external service modules are replaced. Lock queries, BEGIN, ROLLBACK,
backend termination, and connection disposal use real PostgreSQL. Independent
owner and contender pools cannot share a checked-out client. Mailbox work is a
controlled synthetic pause/empty response; AI and application-table access fail
explicitly if accidentally reached. No Gmail or AI service is contacted.

## Verified

- Repeated contenders fail before synthetic mailbox work, without releasing the
  owner's lock; a distinct backend can acquire after normal completion.
- Synthetic work failure rolls back and permits another connection to retry.
- Terminating the owner's backend releases its lock while work is paused; cleanup
  rejects and discards the broken client, and subsequent attempts succeed.
- All three cases also pass through PgBouncer with `pool_mode = transaction`.

## Important boundary

Database lock cleanup is not cancellation of application work. The test installs
an error observer on the checked-out client so it can inspect the database and
cleanup after termination. Production currently has no equivalent observer in
this import path. A disconnect may emit an unhandled client error, and merely
adding a listener would still leave old mailbox/classification work running
after another importer acquires the released lock. This suite does not claim
those application-level failure modes are fixed. They need a separate change
that handles connection errors and prevents stale-owner writes while preserving
already committed partial progress.

Last verified in this workspace: six integration checks passed (direct PostgreSQL
and real PgBouncer); the existing inbox unit/route checks and API typecheck passed.
