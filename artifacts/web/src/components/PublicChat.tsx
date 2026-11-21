import { ChatWidget } from "./ChatWidget";
import { IntercomMessenger } from "./IntercomMessenger";

/** Intercom is the approved default; false is an explicit legacy-chat opt-out. */
export function PublicChat() {
  return import.meta.env.VITE_INTERCOM_MESSENGER_ENABLED !== "false"
    ? <IntercomMessenger />
    : <ChatWidget />;
}
