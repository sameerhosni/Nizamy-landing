# Intercom Messenger

The homepage uses Intercom Messenger for anonymous visitors (workspace/app ID `lrn5nc6m`) by default, as approved by the user. No build-time flag is required. Setting `VITE_INTERCOM_MESSENGER_ENABLED=false` explicitly restores the legacy chatbot after rebuilding. Publishing is required to update an already deployed site. Verify launcher visibility on each target domain: workspace display rules can hide it, and a successful loader response does not prove Fin is answering.

Existing support routes, historical conversations, and admin tools are retained. When enabled, the Intercom widget shuts down when leaving the homepage and follows the site's Arabic/English language. This flag is unrelated to server-side reporting; the staff Intercom view works independently.

No private API token or Replit connector is needed. The current configuration uses Intercom's US Messenger endpoint; change this if the workspace uses EU or Australia data hosting.

In Intercom, enable Messenger for Web and user traffic. Check allowed domains for the production site and any preview used for testing. Fin/automated workflows, knowledge, availability and pricing must be configured in Intercom; installing the widget does not activate a bot or migrate the old chatbot knowledge.

This does not synchronize Intercom conversations into the local support dashboard, or populate traffic/visitor reporting. New Messenger conversations live in Intercom.
