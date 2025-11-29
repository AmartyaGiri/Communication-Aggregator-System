const SUPPORTED_CHANNELS = ['email', 'sms', 'whatsapp'];

function validatePayload(body) {
  const errors = [];
  if (!body) {
    errors.push('body is required');
    return errors;
  }

  if (!body.channel) errors.push('channel is required');
  if (!body.to) errors.push('to is required');
  if (!body.message) errors.push('message is required');

  if (body.channel && !SUPPORTED_CHANNELS.includes(body.channel)) {
    errors.push(`channel must be one of: ${SUPPORTED_CHANNELS.join(', ')}`);
  }

  return errors;
}

module.exports = { validatePayload, SUPPORTED_CHANNELS };


