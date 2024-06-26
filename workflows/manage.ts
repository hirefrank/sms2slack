import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ManageContactDefinition } from "../functions/manage_contact.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/future/forms#add-interactivity
 */
const ManageContactWorkflow = DefineWorkflow({
  callback_id: "manage_contact_workflow",
  title: "SMS Outbound workflow",
  description: "A workflow for sending replies as SMS.",
  input_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
      },
      phone: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.types.string,
      },
    },
    required: ["name", "phone", "channel"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */

const inputForm = ManageContactWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: `SMS to ${ManageContactWorkflow.inputs.name}`,
    interactivity: SMSOutboundWorkflow.inputs.interactivity,
    submit_label: "Send SMS",
    fields: {
      elements: [{
        name: "message",
        title: "Message",
        type: Schema.types.string,
      }],
      required: ["message"],
    },
  },
);

ManageContactWorkflow.addStep(SendTwilioSMSDefinition, {
  sender: SMSOutboundWorkflow.inputs.sender,
  receiver: SMSOutboundWorkflow.inputs.receiver,
  message: inputForm.outputs.fields.message,
});

export default ManageContactWorkflow;
