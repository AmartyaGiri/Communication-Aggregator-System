const path = require("path");

const config = {
  port: process.env.PORT || 4001,
  dbPath:
    process.env.SQLITE_DB_PATH || path.resolve(__dirname, "../messages.db"),
  messageQueryLimit: Number(process.env.MESSAGE_QUERY_LIMIT || 100),
  loggingBaseUrl: process.env.LOGGING_BASE_URL || "http://localhost:4002",
};

module.exports = config;
