'use strict';

const axios = require('axios');
const { MESSAGING_SERVICE_URL } = process.env;

const messagingService = axios.create({
  baseURL: `${MESSAGING_SERVICE_URL}/api/`
});

module.exports = messagingService;
