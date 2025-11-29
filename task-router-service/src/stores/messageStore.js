class MessageStore {
  constructor() {
    this.messages = new Map();
  }

  has(messageId) {
    return this.messages.has(messageId);
  }

  markPending(messageId) {
    this.messages.set(messageId, { status: "pending", attempts: 0 });
  }

  incrementAttempts(messageId) {
    const record = this.messages.get(messageId);
    if (!record) return 0;
    record.attempts += 1;
    return record.attempts;
  }

  markDelivered(messageId) {
    const record = this.messages.get(messageId);
    if (record) {
      record.status = "delivered";
    }
  }

  markFailed(messageId) {
    const record = this.messages.get(messageId);
    if (record) {
      record.status = "failed";
    }
  }

  get(messageId) {
    return this.messages.get(messageId);
  }
}

module.exports = new MessageStore();
