'use strict';

const { AsyncAdapter } = require('../utils');

const asyncInterface = [
  'check'
];

class HealthController {

  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }

  static check(request, h) {

    return h.response({ healthy: true });
  }
}

module.exports = HealthController;
