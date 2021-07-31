'use strict';

const axios = require('axios');
const { SOCIAL_SERVICE_URL } = process.env;

const socialService = axios.create({
  baseURL: `${SOCIAL_SERVICE_URL}/api/`
});

module.exports = socialService;
