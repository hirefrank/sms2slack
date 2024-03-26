import { Trigger } from "deno-slack-api/types.ts";
import SMSInboundWorkflow from "../workflows/inbound.ts";

const trigger: Trigger<typeof SMSInboundWorkflow.definition> = {
  type: "webhook",
  name: "sends 'how cool is tha to my fav channel",
  description: "runs the example workflow",
  workflow: "#/workflows/sms_inbound_workflow",
  inputs: {
    sender: {
      value: "{{data.sender}}",
    },
    receiver: {
      value: "{{data.receiver}}",
    },
    message: {
      value: "{{data.message}}",
    },
  },
};

export default trigger;
