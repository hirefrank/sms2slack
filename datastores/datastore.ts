import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/future/datastores
 */
const ContactsDatastore = DefineDatastore({
  name: "PhoneMappings",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    name: {
      type: Schema.types.string,
    },
    channel: {
      type: Schema.types.string,
    },
  },
});

export default ContactsDatastore;
