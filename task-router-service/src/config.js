const config = {
  port: process.env.PORT || 4000,
  deliveryBaseUrl: process.env.DELIVERY_BASE_URL || 'http://localhost:4001',
  loggingBaseUrl: process.env.LOGGING_BASE_URL || 'http://localhost:4002',
  retry: {
    maxAttempts: Number(process.env.MAX_RETRY_ATTEMPTS || 3)
  }
};

module.exports = config;


