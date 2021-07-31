'use strict';

const axios = require('axios');
const { AUTH_SERVICE_URL } = process.env;

const authService = axios.create({
  baseURL: `${AUTH_SERVICE_URL}/api/`
});

module.exports = authService;
