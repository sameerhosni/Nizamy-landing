# Support portal

The private staff page is `/support`. It must be served over HTTPS for its secure session cookie.

## Runtime requirements

- Apply the API server SQL migrations before deploying the new code.
- PostgreSQL (`DATABASE_URL`) is mandatory for staff login and support knowledge.
- Configure a strong `SESSION_SECRET` and the existing SMTP settings on every server replica. Do not commit their values.
- Sign-in codes expire after ten minutes, permit five attempts, and can be requested once every five minutes. Sessions expire after eight hours.
- Staff authorization is enforced on the server. Public chatbot access does not grant portal access.

## Email import

This is a chatbot teaching workspace, not a ticket management system. Chats appear once per conversation, including all user and assistant messages. Email appears once per thread after relevance classification for genuine Nizamy inquiries from existing or prospective customers. Verification codes, promotions, automated notifications and unrelated email are excluded. Local records refresh when the page loads; Sync sources and the background worker process email.

New means not reviewed, not a proven chatbot failure. Open a conversation, choose Add answer & instructions, write the reusable answer and approve it. Existing per-message imports are retained but hidden from the queue; their guidance remains in the library. Existing unfiltered email imports are hidden and threads reclassified on the next sync. Classification is probabilistic; failed classifications raise an error rather than importing unfiltered mail. Classifications are cached per thread revision.

In the guidance editor, define matching phrases/applicability, necessary clarifying questions, and the approved answer or resolution steps. Remove customer-specific details and approve the case. For a relevant match, the chatbot now attempts the approved resolution before proposing a ticket. It can still escalate when guidance is missing, steps fail, or the customer requests a human. This uses approved reference guidance rather than retraining model weights.

The worker verifies the connected Gmail identity and checks incoming threads every five minutes. Sent-reply auto-draft import is no longer run by the worker or offered in the UI. Incoming content never becomes approved chatbot knowledge automatically.

**Self-hosted deployment is not yet configured for mailbox import.** The Replit Gmail connection does not by itself provide credentials to Docker/Kubernetes. Provision supported connector runtime access or implement a separately authorized mailbox adapter before enabling this feature there. SMTP credentials only send messages; they do not grant Gmail read access.

Imported drafts can contain customer details. Review, remove identifying information, and distinguish diagnostic questions from confirmed solutions before approving. Only approved cases are retrieved by the chatbot. Feedback is visible to staff for manual review; it does not automatically approve or retrain anything.

## Screenshots

Ticket submissions accept up to three PNG, JPEG, or WebP images, each at most 2 MB. They are attached to the team email, not saved in the database or included in general chatbot knowledge. The portal does not retain screenshot previews after ticket submission. Existing ticket emails are sent asynchronously; a created ticket does not prove email delivery.

## Remaining verification

Live SMTP delivery and self-hosted mailbox import need deployment verification. The automated browser test uses controlled authentication fixtures rather than sending login codes or customer tickets.