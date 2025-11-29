const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const messagesRouter = require('./routes/messages');

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/messages', messagesRouter);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'task-router-service' });
  });

  return app;
}

function start() {
  const app = createServer();
  app.listen(config.port, () => {
    console.log(`Task Router Service listening on port ${config.port}`);
  });
  return app;
}

module.exports = { createServer, start };


