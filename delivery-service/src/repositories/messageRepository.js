const db = require("../db");
const config = require("../config");

function saveMessage({ id, channel, to, message }, status) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO messages (id, channel, recipient, body, status) VALUES (?, ?, ?, ?, ?)`,
      [id, channel, to, message, status],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

function listMessages(limit = config.messageQueryLimit) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM messages ORDER BY created_at DESC LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
}

module.exports = { saveMessage, listMessages };
