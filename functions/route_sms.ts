import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ContactsDatastore from "../datastores/datastore.ts";

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
  source_file: "functions/route_sms.ts",
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
      message: {
        type: Schema.types.string,
        description: "SMS message",
      },
    },
    required: [
      "sender",
      "receiver",
      "message",
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
    // assume the number is known
    let button_cta = "Reply via SMS";
    let button_workflow = env["workflow_sms_reply"];
    let button_params = [
      {
        "name": "input_parameter_a",
        "value": "Value for input param A",
      },
      {
        "name": "input_parameter_b",
        "value": "Value for input param B",
      },
    ];

    const phone = inputs.sender;
    let response = await client.apps.datastore.get<
      typeof ContactsDatastore.definition
    >({
      datastore: "PhoneMappings",
      id: phone,
    });

    if (!response.ok) {
      const error = `Failed to fetch row from datastore! - ${response.error}`;
      return { error };
    }

    if (Object.keys(response.item).length === 0) {
      console.log("Contact unknown... adding contact");

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
      }
      response = add;
    }

    const name = response.item.name;
    const channel = response.item.channel;

    if (channel == env["default_channel"]) {
      button_cta = "Manage contact";
      button_workflow = env["workflow_manage_contact"];
      button_params = [
        {
          "name": "input_parameter_a",
          "value": "Value for input param A",
        },
        {
          "name": "input_parameter_b",
          "value": "Value for input param B",
        },
      ];
    }

    console.log("Incoming SMS!");
    // Call the messaging API
    const post = await client.chat.postMessage({
      channel: channel,
      text: `SMS from ${name} (${inputs.sender}): ${inputs.message}`,
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${name} - ${inputs.sender}*`,
          },
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `> ${inputs.message}`,
          },
        },
        {
          "type": "workflow_button",
          "text": {
            "type": "plain_text",
            "text": button_cta,
          },
          "workflow": {
            "trigger": {
              "url": button_workflow,
              "customizable_input_parameters": button_params,
            },
          },
        },
      ],
      metadata: {
        "event_type": "sms_received",
        "event_payload": {
          "sender": inputs.sender,
          "receiver": inputs.receiver,
          "message": inputs.message,
        },
      },
    });
    if (post.error) {
      const error = `Failed to post a message with buttons! - ${post.error}`;
      return { error };
    }
    // Important to set 'completed' to false. We'll update the status later
    // in our action handler
    return { completed: false };

    // return { outputs: {} };
  },
);
