const express = require('express');
const { recordLog } = require('../services/logService');

const router = express.Router();

router.post('/', async (req, res) => {
  const event = req.body || {};
  await recordLog(event);
  res.json({ status: 'ok' });
});

module.exports = router;


