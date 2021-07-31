'use strict';

const axios = require('axios');
const { NOTIFICATION_SERVICE_URL } = process.env;

const messagingService = axios.create({
  baseURL: `${NOTIFICATION_SERVICE_URL}/api/`
});

module.exports = messagingService;
