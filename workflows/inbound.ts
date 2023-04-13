import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { RouteSMSDefinition } from "../functions/route_sms.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/future/forms#add-interactivity
 */
const SMSInboundWorkflow = DefineWorkflow({
  callback_id: "sms_inbound_workflow",
  title: "SMS Inbound workflow",
  description: "A sms workflow",
  input_parameters: {
    properties: {
      sender: {
        type: Schema.types.string,
      },
      receiver: {
        type: Schema.types.string,
      },
      message: {
        type: Schema.types.string,
      },
    },
    required: ["sender", "receiver", "message"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */

SMSInboundWorkflow.addStep(RouteSMSDefinition, {
  sender: SMSInboundWorkflow.inputs.sender,
  receiver: SMSInboundWorkflow.inputs.receiver,
  messsage: SMSInboundWorkflow.inputs.message,
});

export default SMSInboundWorkflow;
