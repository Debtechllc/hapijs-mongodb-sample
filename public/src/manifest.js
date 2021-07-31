'use strict';

const Inert = require('inert');
const Vision = require('vision');
const HapiPino = require('hapi-pino');
const HapiSwagger = require('hapi-swagger');
const HapiBoomDecorators = require('hapi-boom-decorators');
const HapiAuthJwt = require('hapi-auth-jwt2');

const Pack = require('../package.json');
const { compact } = require('lodash');

const { ws, metrics } = require('./plugins');

const { REDIS_URL, REDIS_KEY_PREFIX, GRAYLOG_URL } = process.env;

module.exports = compact([
  {
    plugin: HapiSwagger,
    options: {
      info: {
        title: Pack.name,
        description: Pack.description,
        version: Pack.version
      },
      basePath: '/',
      pathPrefixSize: 2,
      jsonPath: '/docs/swagger.json',
      sortPaths: 'path-method',
      lang: 'en',
      tags: [
        { name: 'api' }
      ],
      expanded: 'none',
      documentationPath: '/docs',
      securityDefinitions: {
        token: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header'
        }
      }
    }
  },
  {
    plugin: HapiPino,
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      logPayload: false,
      logEvents: ['response', 'request-error']
    }
  },
  Inert,
  Vision,
  HapiBoomDecorators,
  HapiAuthJwt,
  {
    plugin: ws,
    options: {
      redisUrl: REDIS_URL,
      redisKeyPrefix: REDIS_KEY_PREFIX
    }
  },
  {
    plugin: metrics,
    options: {
      graylogUrl: GRAYLOG_URL
    }
  }
]);
