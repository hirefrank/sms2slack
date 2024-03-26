import { Trigger } from "deno-slack-sdk/types.ts";
import SMSOutboundWorkflow from "../workflows/outbound.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const trigger: Trigger<typeof SMSOutboundWorkflow.definition> = {
  type: "shortcut",
  name: "Sample trigger",
  description: "A sample trigger",
  workflow: "#/workflows/sms_outbound_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    sender: {
      value: "{{data.sender}}",
    },
    receiver: {
      value: "{{data.receiver}}",
    },
  },
};

export default trigger;
