const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { validatePayload } = require("../utils/validator");
const { sendLog } = require("../clients/loggingClient");
const { forwardToChannel } = require("../clients/deliveryClient");
const messageStore = require("../stores/messageStore");
const config = require("../config");

const router = express.Router();

router.post("/", async (req, res) => {
  const traceId = req.headers["x-trace-id"] || uuidv4();
  const requestSpanId = uuidv4();
  const payload = req.body;

  const validationErrors = validatePayload(payload);
  if (validationErrors.length) {
    await sendLog({
      traceId,
      spanId: requestSpanId,
      service: "task-router-service",
      level: "error",
      message: "Validation failed",
      metadata: { errors: validationErrors },
    });
    return res.status(400).json({ errors: validationErrors });
  }

  const messageId = payload.id || uuidv4();
  payload.id = messageId;

  if (messageStore.has(messageId)) {
    await sendLog({
      traceId,
      spanId: requestSpanId,
      service: "task-router-service",
      level: "info",
      message: "Duplicate message detected, ignoring",
      metadata: { messageId },
    });
    return res.status(200).json({ status: "duplicate_ignored", messageId });
  }

  messageStore.markPending(messageId);

  let attempts = 0;
  let lastError = null;

  while (attempts < config.retry.maxAttempts) {
    attempts = messageStore.incrementAttempts(messageId);
    const routingSpanId = uuidv4();
    try {
      await sendLog({
        traceId,
        spanId: routingSpanId,
        parentSpanId: requestSpanId,
        service: "task-router-service",
        level: "info",
        message: `Routing message to ${payload.channel}`,
        metadata: { messageId, channel: payload.channel },
      });

      const { data } = await forwardToChannel(
        payload.channel,
        payload,
        traceId,
        routingSpanId
      );

      messageStore.markDelivered(messageId);
      await sendLog({
        traceId,
        spanId: requestSpanId,
        service: "task-router-service",
        level: "info",
        message: "Message delivered successfully",
        metadata: { messageId, attempts },
      });

      return res.status(200).json({
        status: "delivered",
        attempts,
        messageId,
        delivery: data,
      });
    } catch (err) {
      lastError = err;
      messageStore.markFailed(messageId);

      await sendLog({
        traceId,
        spanId: requestSpanId,
        service: "task-router-service",
        level: "error",
        message: "Delivery attempt failed",
        metadata: {
          messageId,
          attempts,
          error: err.message,
        },
      });
    }
  }

  return res.status(502).json({
    status: "failed",
    attempts,
    messageId,
    error: lastError ? lastError.message : "Unknown error",
  });
});

module.exports = router;
