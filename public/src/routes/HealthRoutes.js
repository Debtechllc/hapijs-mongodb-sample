'use strict';

const { AsyncAdapter: HealthController } = require('../controllers/HealthController');

module.exports = [{
  path: '/api/health',
  method: 'GET',
  handler: HealthController.check,
  config: {
    tags: ['api'],
    description: 'Check server health'
  }
}, {
  path: '/',
  method: 'GET',
  handler: HealthController.check
}];
