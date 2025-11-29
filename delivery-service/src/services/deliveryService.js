const { v4: uuidv4 } = require("uuid");
const { saveMessage } = require("../repositories/messageRepository");
const { sendLog } = require("../clients/loggingClient");

function assertPayload(payload = {}) {
  const missingFields = ["id", "to", "message"].filter(
    (field) => !payload[field]
  );
  if (missingFields.length) {
    const error = new Error(`Missing fields: ${missingFields.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

async function deliver(channel, payload, traceId, parentSpanId) {
  assertPayload(payload);

  const deliverySpanId = uuidv4();

  await sendLog({
    traceId: traceId || null,
    spanId: deliverySpanId,
    parentSpanId: parentSpanId || null,
    service: "delivery-service",
    level: "info",
    message: `Delivering ${channel} message`,
    metadata: {
      channel,
      messageId: payload.id,
      recipient: payload.to,
    },
  });

  await saveMessage(
    { id: payload.id, channel, to: payload.to, message: payload.message },
    "sent"
  );

  await sendLog({
    traceId: traceId || null,
    spanId: deliverySpanId,
    parentSpanId: parentSpanId || null,
    service: "delivery-service",
    level: "info",
    message: `Message delivered successfully via ${channel}`,
    metadata: {
      channel,
      messageId: payload.id,
      recipient: payload.to,
      status: "sent",
    },
  });

  return {
    id: payload.id,
    channel,
    to: payload.to,
    message: payload.message,
    status: "sent",
  };
}

module.exports = { deliver };
