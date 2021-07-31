'use strict';

const url = require('url');
const gelf = require('gelf-pro');

exports.register = async function(server, options) {

  const { graylogUrl } = options;

  if (!graylogUrl) {
    server.logger().warn('Metrics GELF connector has not been initialized, no metrics will be sent');
    await server.expose('send', function() {
      // Do nothing; Nowhere to send data
    });
    return;
  }

  const { hostname: host, port } = url.parse(graylogUrl);

  gelf.setConfig({
    adapterOptions: {
      host,
      port
    }
  });

  await server.expose('send', function(msg, extra) {
    return new Promise((resolve, reject) => {
      try {
        gelf.info(msg, extra, (err) => {
          if (err) {
            server.logger().error(err);
            return resolve(false);
          }
          resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  });

};

exports.name = 'metrics';
exports.version = '0.0.1';
