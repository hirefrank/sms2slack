import { Manifest } from "deno-slack-sdk/mod.ts";
import ContactsDatastore from "./datastores/datastore.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "sms2slack",
  description:
    "A set of functions for routing/sending SMS messages from Twilio with Slack.",
  icon: "assets/default_new_app_icon.png",
  workflows: [],
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
