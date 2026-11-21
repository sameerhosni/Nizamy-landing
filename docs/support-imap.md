# Support mailbox on the cluster

Incoming conversations and sent support replies now default to direct Gmail IMAP, not Replit authentication.

Subjects containing `Explee` (case-insensitive, anywhere in the subject) are excluded. IMAP checks envelope headers before fetching message bodies, including direct thread/message lookups. The legacy connector checks subject metadata first and skips a whole thread if any message matches. Existing saved records are not deleted by this rule.

- `IMAP_HOST=imap.gmail.com` (default)
- `IMAP_PORT=993` (default, TLS required)
- `IMAP_USERNAME` and `IMAP_PASSWORD`: optional dedicated secrets; otherwise the existing `SMTP_USERNAME` and `SMTP_PASSWORD` are used.
- The username must be the support mailbox, sales@nizamy.app. Use the Gmail app password tested by the administrator, not a normal account password if Google requires an app password.
- The cluster must permit outbound TLS to port 993 and the account must allow IMAP.
- `SUPPORT_MAIL_PROVIDER=replit` explicitly opts into the legacy connector for development/testing only. Leave unset or use `imap` on the cluster.

SMTP sending is unchanged. IMAP opens All Mail read-only and does not mark, move or delete messages. Gmail decimal message/thread IDs are converted to the existing REST hexadecimal IDs, preserving deduplication. Classification is refreshed once after switching providers.

No database migration is needed. Deploy the updated application and dependencies through the existing pipeline; do not place passwords in Git or logs. An import error remains visible rather than falling back to another mailbox. Messages over 2 MB fail explicitly. Each mailbox read uses a fresh read-only connection with timeouts and a four-minute deadline, closed before classification/database work; classification time does not consume that deadline. A healthy connection returning no matching message is treated as a message moved/deleted since listing and skipped without overwriting saved data. Connection failures still fail explicitly, and the next import can retry. Existing database locking and partial-progress behavior are unchanged.

Verify a manual incoming-email import and a sent-reply import after release, then check the next scheduled import. Workspace tests use mocks and do not prove cluster connectivity.

The incoming-import lock transaction uses a transaction-local idle timeout exemption, with a ten-minute application deadline. No database-wide settings or schema are changed. Checked-out connection errors are handled and the failed connection is discarded; classification receives an abort signal and late mailbox/classification results cannot initiate further writes. Already-submitted independent SQL statements may finish, and previously saved progress remains saved. This is cancellation, not atomic database fencing.
