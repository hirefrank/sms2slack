import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Twilio } from "https://deno.land/x/twilio/Twilio.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const SendTwilioSMSDefinition = DefineFunction({
  callback_id: "send_twilio_sms",
  title: "Send Twilio SMS function",
  description:
    "Given a phone number it returns the contact or create a new contact if one doesn't exist with passed in values.",
  source_file: "functions/get_or_create_contact.ts",
  input_parameters: {
    properties: {
      sender: {
        type: Schema.types.string,
        description: "SMS Sender",
      },
      message: {
        type: Schema.types.string,
        description: "Name of the SMS Sender",
      },
      receiver: {
        type: Schema.types.string,
        description: "Channel the SMS will be posted in",
      },
    },
    required: [
      "sender",
      "message",
      "receiver",
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
  SendTwilioSMSDefinition,
  async ({ inputs, env }) => {
    const twilio = new Twilio(
      env["accountSID"],
      env["authToken"],
      "",
      inputs.sender,
    );

    await twilio.sendMessage(inputs.receiver, inputs.message);
    return { outputs: {} };
  },
);
