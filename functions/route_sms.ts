import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { GetOrCreateContactDefinition } from "./get_or_create_contact.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const RouteSMSDefinition = DefineFunction({
  callback_id: "route_sms",
  title: "Route SMS to the appropriate channel",
  description:
    "Given a phone number it returns the contact or create a new contact if one doesn't exist with passed in values.",
  source_file: "functions/get_or_create_contact.ts",
  input_parameters: {
    properties: {
      sender: {
        type: Schema.types.string,
        description: "SMS Sender",
      },
      receiver: {
        type: Schema.types.string,
        description: "SMS Receiver",
      },
      messsage: {
        type: Schema.types.string,
        description: "SMS message",
      },
    },
    required: [
      "sender",
      "receiver",
      "messsage",
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
  RouteSMSDefinition,
  async ({ inputs, client, env }) => {
    const [name, channel, button_cta, button_workflow] =
      await GetOrCreateContactDefinition({
        sender: inputs.sender,
        name: env["default_name"],
        channel: env["default_channel"],
      });

    // do something with
    // name, channel, button_cta, button_workflow

    return { outputs: {} };
  },
);
