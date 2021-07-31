'use strict';

const JWT = require('jsonwebtoken');
const authService = require('./authService');

const { JWT_SECRET_KEY } = process.env;

class JWTAuth {

  static authenticate(user, session) {

    return JWT.sign({ user, session }, JWT_SECRET_KEY, {
      algorithm: 'HS256'
    });
  }

  static verify(token) {
    return JWT.verify(token, JWT_SECRET_KEY);
  }

  static async validate(decoded) {

    const { user, session } = decoded;

    try {
      await authService.get(`sessions/${user.id}/${session.deviceId}`);
    } catch (err) {

      if (!err.response) {
        throw err;
      }

      if (err.response.data.message === 'Session not found') {
        return { isValid: false };
      }

      throw err;
    }

    return { isValid: true, credentials: { user, session } };
  }
}

module.exports = JWTAuth;
