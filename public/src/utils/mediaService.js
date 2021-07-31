'use strict';

const axios = require('axios');
const { MEDIA_SERVICE_URL } = process.env;

const messagingService = axios.create({
  baseURL: `${MEDIA_SERVICE_URL}/api/`
});

module.exports = messagingService;
