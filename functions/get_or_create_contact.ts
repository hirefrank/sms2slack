import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ContactsDatastore from "../datastores/datastore.ts";
/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const GetOrCreateContactDefinition = DefineFunction({
  callback_id: "get_or_create_contact",
  title: "Get or Create Contact function",
  description:
    "Given a phone number it returns the contact or create a new contact if one doesn't exist with passed in values.",
  source_file: "functions/get_or_create_contact.ts",
  input_parameters: {
    properties: {
      sender: {
        type: Schema.types.string,
        description: "SMS Sender",
      },
      name: {
        type: Schema.types.string,
        description: "Name of the SMS Sender",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel the SMS will be posted in",
      },
    },
    required: [
      "sender",
      "name",
      "channel",
    ],
  },
  output_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
        description: "Name of the sender",
      },
      channel: {
        type: Schema.types.string,
        description: "Channel for the sender",
      },
      button_cta: {
        type: Schema.types.string,
        description: "CTA for the workflow button",
      },
      button_workflow: {
        type: Schema.types.string,
        description: "Workflow to run for the button",
      },
    },
    required: ["name", "channel", "button_cta", "button_workflow"],
  },
});

// This function takes the input from the open form step, adds formatting, saves our
// updated object into the Slack hosted datastore, and returns the updated message.
export default SlackFunction(
  GetOrCreateContactDefinition,
  async ({ inputs, client, env }) => {
    // assume the number is known
    let button_cta = env["button_cta_reply"];
    let button_workflow = env["workflow_sms_reply"];

    const phone = inputs.sender;
    let response = await client.apps.datastore.get<
      typeof ContactsDatastore.definition
    >({
      datastore: "PhoneMappings",
      id: phone,
    });

    if (!response.ok) {
      const add = await client.apps.datastore.put<
        typeof ContactsDatastore.definition
      >({
        datastore: "PhoneMappings",
        item: {
          id: phone,
          name: env["default_name"],
          channel: env["default_channel"],
        },
      });

      if (!add.ok) {
        const error = `Failed to add row to datastore: ${response.error}`;
        return { error };
      } else {
        response = add;
      }

      button_cta = env["button_cta_manage"];
      button_workflow = env["workflow_manage_contact"];
    }

    const name = response.item.name;
    const channel = response.item.channel;

    return { outputs: { name, channel, button_cta, button_workflow } };
  },
);
