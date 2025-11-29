const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const logsRouter = require('./routes/logs');

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/logs', logsRouter);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'logging-service' });
  });

  return app;
}

function start() {
  const app = createServer();
  app.listen(config.port, () => {
    console.log(`Logging Service listening on port ${config.port}`);
  });
  return app;
}

module.exports = { createServer, start };


