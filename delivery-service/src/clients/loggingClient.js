const axios = require('axios');
const config = require('../config');

async function sendLog(event = {}) {
  try {
    await axios.post(`${config.loggingBaseUrl}/logs`, event);
  } catch (err) {
    console.error('[delivery-service] Failed to send log', err.message);
  }
}

module.exports = { sendLog };


