'use strict';

const axios = require('axios');
const { BILLING_SERVICE_URL } = process.env;

const billingService = axios.create({
  baseURL: `${BILLING_SERVICE_URL}/api/`
});

module.exports = billingService;
