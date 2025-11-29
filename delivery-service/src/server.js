const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const sendRouter = require('./routes/send');

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/', sendRouter);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'delivery-service' });
  });

  return app;
}

function start() {
  const app = createServer();
  app.listen(config.port, () => {
    console.log(`Delivery Service listening on port ${config.port}`);
  });
  return app;
}

module.exports = { createServer, start };


