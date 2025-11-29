const { Client } = require('@elastic/elasticsearch');
const config = require('../config');

function createClient() {
  try {
    return new Client({ node: config.elasticNode });
  } catch (err) {
    console.error('[logging-service] Failed to init Elasticsearch client', err.message);
    return null;
  }
}

const esClient = createClient();

module.exports = esClient;


