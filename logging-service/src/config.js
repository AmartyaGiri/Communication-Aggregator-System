const config = {
  port: process.env.PORT || 4002,
  elasticNode: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  elasticIndex: process.env.ELASTICSEARCH_INDEX || 'service-logs'
};

module.exports = config;


