const axios = require('axios');
const config = require('../config');

async function forwardToChannel(channel, payload, traceId, parentSpanId) {
  const routePath = `/send/${channel}`;
  const response = await axios.post(
    `${config.deliveryBaseUrl}${routePath}`,
    payload,
    {
      headers: {
        'x-trace-id': traceId,
        'x-parent-span-id': parentSpanId || null
      }
    }
  );

  return { data: response.data, routePath };
}

module.exports = { forwardToChannel };


