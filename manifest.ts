import { Manifest } from "deno-slack-sdk/mod.ts";
import ContactsDatastore from "./datastores/datastore.ts";
import SMSInboundWorkflow from "./workflows/inbound.ts";
import SMSOutboundWorkflow from "./workflows/outbound.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "sms2slack",
  description:
    "A set of workflows for routing/sending SMS messages from Twilio with Slack.",
  icon: "assets/sms-icon.png",
  workflows: [SMSInboundWorkflow, SMSOutboundWorkflow],
  outgoingDomains: ["twilio.com"],
  datastores: [ContactsDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
