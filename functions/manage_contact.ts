import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ContactsDatastore from "../datastores/datastore.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const ManageContactDefinition = DefineFunction({
  callback_id: "manage_contact",
  title: "Route SMS to the appropriate channel",
  description:
    "Given a phone number it returns the contact or create a new contact if one doesn't exist with passed in values.",
  source_file: "functions/manage_contact.ts",
  input_parameters: {
    properties: {
      sender: {
        type: Schema.types.string,
        description: "SMS Sender",
      },
      name: {
        type: Schema.types.string,
        description: "SMS Receiver",
      },
      channel: {
        type: Schema.types.string,
        description: "SMS message",
      },
    },
    required: [
      "sender",
      "name",
      "channel",
    ],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

// This function takes the input from the open form step, adds formatting, saves our
// updated object into the Slack hosted datastore, and returns the updated message.
export default SlackFunction(
  ManageContactDefinition,
  async ({ inputs, client }) => {
    const create_or_update = await client.apps.datastore.update<
      typeof ContactsDatastore.definition
    >({
      datastore: "PhoneMappings",
      item: {
        id: inputs.sender,
        name: inputs.name,
        channel: inputs.channel,
      },
    });

    if (!create_or_update.ok) {
      const error = `Failed to add row to datastore: ${create_or_update.error}`;
      return { error };
    }

    return { outputs: {} };
  },
);
