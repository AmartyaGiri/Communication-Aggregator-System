const config = require("../config");
const esClient = require("../clients/elasticsearchClient");

async function persistLog(doc) {
  if (!esClient) {
    return;
  }

  try {
    await esClient.index({
      index: config.elasticIndex,
      document: doc,
    });
  } catch (err) {
    console.error("[logging-service] Failed to index log", err.message);
  }
}

async function recordLog(event = {}) {
  const doc = {
    traceId: event.traceId || null,
    spanId: event.spanId || null,
    parentSpanId: event.parentSpanId || null,
    service: event.service || "unknown",
    level: event.level || "info",
    message: event.message || "",
    metadata: event.metadata || {},
    timestamp: new Date().toISOString(),
  };

  console.log("[Logging Service]", JSON.stringify(doc));
  await persistLog(doc);
  return doc;
}

module.exports = { recordLog };
