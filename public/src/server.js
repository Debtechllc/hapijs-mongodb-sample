/* eslint-disable no-console, no-magic-numbers */
'use strict';

const Hapi = require('hapi');

const manifest = require('./manifest');
const routes = require('./routes');

const { JWTAuth } = require('./utils');

const { NODE_ENV, PORT, HOST_URI, JWT_SECRET_KEY } = process.env;

var fs = require('fs');

// var tls = {
//   key: fs.readFileSync('/usr/src/app/src/config/privkey.pem'),
//   cert: fs.readFileSync('/usr/src/app/src/config/cert.pem')
// };


const server = new Hapi.Server({
  port: NODE_ENV === 'test' ? null : PORT || 3000,
  uri: HOST_URI,
  routes: {
    cors: {
      origin: ['*'],
      credentials: true
    },
    timeout: {
      socket: 240000,
      server: 180000
    }
  },
  // tls: {
  //   key: fs.readFileSync('/usr/src/app/src/config/privkey.pem'),
  //   cert: fs.readFileSync('/usr/src/app/src/config/cert.pem')
  // }
});

// server.connection({address: '0.0.0.0', port: 443, tls: tls });
// server.connection({address: '0.0.0.0', port: 80 });


async function start() {

  try {
    await server.register(manifest);

    server.auth.strategy('token', 'jwt', {
      key: JWT_SECRET_KEY,
      validate: JWTAuth.validate,
      verifyOptions: {
        algorithms: ['HS256']
      }
    });

    server.route(routes);

    server.ext('onRequest', (request, h) => {
      request.headers['x-forwarded-host'] = (request.headers['x-forwarded-host'] || request.info.host);
      return h.continue;
    });

    await server.start();

  } catch (err) {
    console.log(err);
    throw err;
  }

  console.log('Server running at:', server.info.uri);
}

process.on('unhandledRejection', (err) => {

  console.log(err);
  throw err;
});

start();

module.exports = server;
