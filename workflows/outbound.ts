import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendTwilioSMSDefinition } from "../functions/send_sms.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/future/forms#add-interactivity
 */
const SMSOutboundWorkflow = DefineWorkflow({
  callback_id: "sms_outbound_workflow",
  title: "SMS Outbound workflow",
  description: "A workflow for sending replies as SMS.",
  input_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
      },
      sender: {
        type: Schema.types.string,
      },
      receiver: {
        type: Schema.types.string,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["name", "sender", "receiver", "interactivity"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */

const inputForm = SMSOutboundWorkflow.addStep(Schema.slack.functions.OpenForm, {
  title: `SMS to ${SMSOutboundWorkflow.inputs.name}`,
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
});

SMSOutboundWorkflow.addStep(SendTwilioSMSDefinition, {
  sender: SMSOutboundWorkflow.inputs.sender,
  receiver: SMSOutboundWorkflow.inputs.receiver,
  message: inputForm.outputs.fields.message,
});

export default SMSOutboundWorkflow;
