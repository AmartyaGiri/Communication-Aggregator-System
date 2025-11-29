const express = require("express");
const { deliver } = require("../services/deliveryService");
const { listMessages } = require("../repositories/messageRepository");

const router = express.Router();
const CHANNELS = ["email", "sms", "whatsapp"];

CHANNELS.forEach((channel) => {
  router.post(`/send/${channel}`, async (req, res) => {
    const traceId = req.headers["x-trace-id"] || null;
    const parentSpanId = req.headers["x-parent-span-id"] || null;
    try {
      const response = await deliver(channel, req.body, traceId, parentSpanId);
      res.json(response);
    } catch (err) {
      const status = err.status || 500;
      const message = err.status ? err.message : "Failed to deliver message";
      console.error(`[Delivery Service] ${message}`, err.message);
      res.status(status).json({ error: message });
    }
  });
});

router.get("/messages", async (_req, res) => {
  try {
    const messages = await listMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to query messages" });
  }
});

module.exports = router;
