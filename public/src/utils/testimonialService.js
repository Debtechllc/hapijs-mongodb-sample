'use strict';

const axios = require('axios');
const { TESTIMONIAL_SERVICE_URL } = process.env;

const testimonialService = axios.create({
  baseURL: `${TESTIMONIAL_SERVICE_URL}/api/`
});

module.exports = testimonialService;
