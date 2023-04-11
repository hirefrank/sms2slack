import { Manifest } from "deno-slack-sdk/mod.ts";
import ContactsDatastore from "./datastores/datastore.ts";
import { GetOrCreateContactDefinition } from "./functions/get_or_create_contact.ts";
import { SendTwilioSMSDefinition } from "./functions/send_sms.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "sms2slack",
  description:
    "A set of functions for routing/sending SMS messages from Twilio with Slack.",
  icon: "assets/sms-icon.png",
  workflows: [],
  functions: [GetOrCreateContactDefinition, SendTwilioSMSDefinition],
  outgoingDomains: ["twilio.com"],
  datastores: [ContactsDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "workflow.steps:execute",
  ],
});
