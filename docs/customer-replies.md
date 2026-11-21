# Customer replies

## Staff use

Open Support → Customer questions, choose a chat, and use **Reply to customer**.
The Tickets tab provides the equivalent reply history and composer for tickets.
Direct replies are distinct from AI teaching instructions.

Replies are stored before optional email delivery. Email can be selected only
when the conversation or ticket has a recipient address. Sending is manual;
there is no email blast to historical customers. A mail failure does not remove
the stored reply. Confirmed failures allow retry; uncertain delivery outcomes
must not be blindly retried because the first attempt may already have arrived.

## Customer use

New conversations are recovered in the same browser after reload. Team replies
are labeled separately from AI answers. Customers can optionally provide an
email address and agree to reply notifications, then remove that address.
Opening the chat refreshes its conversation while the page is visible.
Starting a new chat forgets the browser's previous conversation credentials.

This is not cross-device account-based recovery. Clearing browser storage loses
access to the stored conversation. Historical conversations created before
access tokens existed cannot safely be recovered by the new client; customers
need to start a new conversation.

## Release

The additive migration `20261010_staff_replies.sql` must run before the updated
API handles chat traffic. The existing Docker entrypoint and Jenkins migration
step run pending migrations; retain that ordering when deploying elsewhere.
Missing schema fails explicitly rather than creating unprotected conversations.

Development migration and isolated browser fixtures are not production changes.
Production requires its own valid SMTP configuration for email notifications.
API acceptance of an email does not prove inbox delivery.
