'use strict';

const Boom = require('boom');
const { AsyncAdapter, JWTAuth, authService } = require('../utils');

const asyncInterface = [
  'login',
  'logout',
  'register',
  'socialRegister',
  'passwordReset',
  'verifyOtp',
  'updatePassword',
  'changePassword',
  'VerifyRegistationOtp',
  'resendOtp',
  'settings'
];

class AuthController {

  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }

  static async login(request, h) {

    const { login, password, deviceId, os } = request.payload;

    try {
      const { user, session } = (await authService.post('sessions', {
        login, password, deviceId, os
      })).data;

      const token = JWTAuth.authenticate(user, session);

      return h.response({
        user, token, session
      });
    } catch (err) {

      if (!err.response) {
        return err;
      }

      if (err.response.data.message === 'User not found') {
        return h.unauthorized();
      }

      if (err.response.data.message === 'Invalid password') {
        return h.unauthorized();
      }

      return err;
    }
  }

  static async logout(request, h) {

    const { credentials: { user, session } } = request.auth;
    const { all } = request.payload;

    if (all) {
      await authService.delete(`sessions/${user.id}`);
    } else {
      await authService.delete(`sessions/${user.id}/${session.deviceId}`);
    }

    return h.response({ success: true });
  }

  static async register(request, h) {

    const { name, email, password } = request.payload;

    try {
      await authService.post('users', request.payload);

      const { user, session } = (await authService.post('sessions', {
        login: email, password, deviceId: 'init', os: 'Initial Registration'
      })).data;

      const token = JWTAuth.authenticate(user, session);
      let message = 'Verification code is sent to your mail.'
      
      return h.response({ token, message, user });
    } catch (err) {

      if (!err.response) {
        return err;
      }

      if (err.response.data.message === 'User already exists') {
        const boomErr = Boom.badRequest('User already exists');
        boomErr.output.payload.errors = err.response.data.errors;

        return boomErr;
      }

      return err;
    }
  }
  static async VerifyRegistationOtp(request, h) {

    const { otp } = request.payload;
    const { credentials: { user } } = request.auth;
    console.log(user)
    //try {
      let response
      let verify = await authService.post('verifyregistationotp', { userId:user.id, otp:otp });
      console.log(verify)
      
      if(verify.data && verify.data.error == 0){
        response  = verify.data ? verify.data : {}
        return h.response({ user, response });
      }
      else{
        response  = verify.data ? verify.data : {}
        return h.response({ response });
      }
     

      
    // } catch (err) {

    //   if (!err.response) {
    //     return err;
    //   }

    //   if (err.response.data.message === "Verification code doesn't match") {
    //     const boomErr = Boom.badRequest('User already exists');
    //     boomErr.output.payload.errors = err.response.data.errors;

    //     return boomErr;
    //   }

    //   return err;
    // }
  }

  static async socialRegister(request, h) {

    const { name, email, provider, socialId } = request.payload;

    try {
      await authService.post('social-users', { name, email, provider, socialId });

      const { user, session } = (await authService.post('social-sessions', {
        login: email, 
        deviceId: 'init', 
        os: 'Initial Registration', 
        provider: provider, 
        socialId: socialId
      })).data;


      //request.server.plugins.metrics.send('signup', { user });

      const token = JWTAuth.authenticate(user, session);

      return h.response({ user, token, session });
    } catch (err) {

      if (!err.response) {
        return err;
      }

      if (err.response.data.message === 'User already exists') {
        const boomErr = Boom.badRequest('User already exists');
        boomErr.output.payload.errors = err.response.data.errors;

        return boomErr;
      }

      return err;
    }
  }

  static async passwordReset(request, h) {

    const { login } = request.payload;
    try {
      let record = await authService.post('recover', { login });

      let response = record ? record.data :  {data: {}, error:'1', message:'Somthing wrong!'}
      return h.response({ response });
    } catch (err) {
      let response = {data: {}, error:'1', message:err}
      return h.response({ response });
    }

  }
  static async verifyOtp(request, h) {
    try {
      let record = await authService.post('verifyotp', request.payload);
      console.log(record)
      let response = record ? record.data :  {data: {}, error:'1', message:'Somthing wrong!'}
      return h.response({ response });
    } catch (err) {
      let response = {data: {}, error:'1', message:err}
      return h.response({ response });
    }
  }
  static async updatePassword(request, h) {
    try {
      let record = await authService.post('changepassword', request.payload);
      
      let response = record ? record.data :  {data: {}, error:'1', message:'Somthing wrong!'}
      return h.response({ response });
    } catch (err) {
      console.log(err)
      let response = {data: {}, error:'1', message:err}
      return h.response({ response });
    }
  }
  
  static async changePassword(request, h) {
    try {
      const { credentials: { user } } = request.auth;
      let record = await authService.post('modifypasswordwithold', {old_password: request.payload.old_password, new_password: request.payload.new_password, userId:user.id});
      let response = record ? record.data :  {data: {}, error:'1', message:'Somthing wrong!'}
      return h.response({ response });
    } catch (err) {
      console.log(err)
      let response = {data: {}, error:'1', message:'Somthing wrong!'}
      return h.response({ response });
    }
  }

  static async resendOtp(request, h) {

    //try {
      let verify = await authService.post('resendotp',  request.payload );
      
      let response  = verify.data ? verify.data : {}
      return h.response({ response });
     

      
    // } catch (err) {

    //   if (!err.response) {
    //     return err;
    //   }

    //   if (err.response.data.message === "Verification code doesn't match") {
    //     const boomErr = Boom.badRequest('User already exists');
    //     boomErr.output.payload.errors = err.response.data.errors;

    //     return boomErr;
    //   }

    //   return err;
    // }
  }

  static async settings(request, h) {
    //try {
      const { user: { id: userId } } = request.auth.credentials;
      let record = await authService.post(`settings/${userId}`, request.payload);
      let response = record ? record.data :  {data: {}, error:'1', message:'Somthing wrong!'}
      return h.response({ response });
    // } catch (err) {
    //   console.log(err)
    //   let response = {data: {}, error:'1', message:'Somthing wrong!'}
    //   return h.response({ response });
    // }
  }
  
}

module.exports = AuthController;
