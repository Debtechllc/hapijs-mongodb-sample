'use strict';

const socketIo = require('socket.io');
const Redis = require('ioredis');
const redisAdapter = require('socket.io-redis');

const { JWTAuth } = require('../utils');

exports.register = async function(server, options) {

  const { redisUrl, redisKeyPrefix } = options;

  const pubClient = new Redis(redisUrl, {
    keyPrefix: redisKeyPrefix || 'ws-message:'
  });
  const subClient = new Redis(redisUrl, {
    keyPrefix: redisKeyPrefix || 'ws-message:'
  });

  const io = socketIo(server.listener);
  io.adapter(redisAdapter({ pubClient, subClient }));

  io.on('connection', function(socket) {

    socket.authorized = false;
    socket.emit('auth');

    socket.on('auth', async function(data) {

      const { token } = data;

      try {
        const { isValid, credentials: { user } } = await JWTAuth.validate(
          JWTAuth.verify(token)
        );

        if (!isValid) {
          return socket.disconnect(true);
        }

        socket.authorized = true;
        socket.user = user;

        socket.join(`user_${socket.user.id}`);
        socket.join(`debtech`);
      } catch (err) {
        server.logger().error(err);
        socket.disconnect(true);
      }
    });

    socket.on('watchmovie', async function(data) {
      //console.log('watchmovie')
      //console.log(io.sockets.sockets, socket.id)
      //io.to(`debtech`).emit('watchmovie', {movie:'https://debtechllc.com/test.mp4'});
      Object.keys(io.sockets.sockets).forEach((socketid) => {
        if(socket.id !== socketid) {
          socket.broadcast.to(socketid).emit('watchmovie', data);
        }
      });
    })
    socket.on('pausemovie', async function(data) {
      //console.log('pausemovie')
      //io.to(`debtech`).emit('pausemovie', {movie:'https://debtechllc.com/test.mp4'});
      Object.keys(io.sockets.sockets).forEach((socketid) => {
        if(socket.id !== socketid) {
          socket.broadcast.to(socketid).emit('pausemovie', data);
        }
      });
    })
    socket.on('resumemovie', async function(data) {
      //console.log('resumemovie')
      //io.to(`debtech`).emit('resumemovie', {movie:'https://debtechllc.com/test.mp4'});
      Object.keys(io.sockets.sockets).forEach((socketid) => {
        if(socket.id !== socketid) {
          socket.broadcast.to(socketid).emit('resumemovie', data);
        }
      });
    })
    socket.on('stopmovie', async function(data) {
      //console.log('stopmovie')
      //io.to(`debtech`).emit('stopmovie', {movie:'https://debtechllc.com/test.mp4'});
      Object.keys(io.sockets.sockets).forEach((socketid) => {
        if(socket.id !== socketid) {
          socket.broadcast.to(socketid).emit('stopmovie', data);
        }
      });
    })

    socket.on('seekmovie', async function(data) {
      //console.log('seekmovie')
      //io.to(`debtech`).emit('seekmovie', data);
      Object.keys(io.sockets.sockets).forEach((socketid) => {
        if(socket.id !== socketid) {
          socket.broadcast.to(socketid).emit('seekmovie', data);
        }
      });
    })

    socket.on('continuemovie', async function(data) {
      data.movie = 'https://debtechllc.com/test.mp4';
      Object.keys(io.sockets.sockets).forEach((socketid) => {
        if(socket.id !== socketid) {
          console.log(socketid, 'ALLLLLL')
          socket.broadcast.to(socketid).emit('continuemovie', data);
        }
      });
    })




  });

  await Promise.resolve();
};

exports.name = 'ws';
exports.version = '0.0.1';
