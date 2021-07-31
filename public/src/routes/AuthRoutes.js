'use strict';

const Joi = require('joi');
const { AsyncAdapter: AuthController } = require('../controllers/AuthController');
const { reformatValidationOutput } = require('../utils');

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 36;
const MIN_PASSWORD_LENGTH = 6;
const PROVIDERS = ['google', 'facebook', 'twitter', 'general', 'apple']

module.exports = [{
  path: '/api/auth/register',
  method: 'POST',
  handler: AuthController.register,
  config: {
    tags: ['api'],
    description: 'Register new user',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        email: Joi.string().email().required().description('the unique email for the user'),
        name: Joi.string().required().description('the name for the user'),
        phone: Joi.string().description('the phone for the user'),
        dob: Joi.date().description('the dob for the user and format YYYY-MM-DD'),
        password: Joi.string().required().description('the password for the user')
      }
    }
  }
}, {
  path: '/api/auth/social-register',
  method: 'POST',
  handler: AuthController.socialRegister,
  config: {
    tags: ['api'],
    description: 'Register new user from social',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        name: Joi.string().required().trim(),
        //username: Joi.string().lowercase().alphanum().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH).required().trim(),
        email: Joi.string().email().lowercase().required().trim(),
        //provider: Joi.string().valid(PROVIDERS).optional()
        provider: Joi.string().required().default('general'),
        socialId: Joi.string().required()
        //password: Joi.string().min(MIN_PASSWORD_LENGTH).required()
      }
    }
  }
}, {
  path: '/api/auth/login',
  method: 'POST',
  handler: AuthController.login,
  config: {
    tags: ['api'],
    description: 'Authenticate user',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        login: Joi.string().lowercase().required(),
        password: Joi.string().required(),
        deviceId: Joi.string().optional().default('0'),
        os: Joi.string().optional().default('Unknown')
      }
    }
  }
}, {
  path: '/api/auth/logout',
  method: 'POST',
  handler: AuthController.logout,
  config: {
    tags: ['api'],
    auth: 'token',
    description: 'Deauthenticate user',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        all: Joi.boolean().optional().default(false)
      }
    }
  }
}, {
  path: '/api/auth/recover',
  method: 'POST',
  handler: AuthController.passwordReset,
  config: {
    tags: ['api'],
    description: 'Reset user password via email',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        login: Joi.string().lowercase().required()
      }
    }
  }
}, {
  path: '/api/auth/verifyotp',
  method: 'POST',
  handler: AuthController.verifyOtp,
  config: {
    tags: ['api'],
    description: 'verify otp via email',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        otp: Joi.string().lowercase().required(),
        userId: Joi.number().integer().min(0).required()
      }
    }
  }
}, {
  path: '/api/auth/updatepassword',
  method: 'POST',
  handler: AuthController.updatePassword,
  config: {
    tags: ['api'],
    description: 'Update user password',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        password: Joi.string().min(MIN_PASSWORD_LENGTH).required(),
        userId: Joi.number().integer().min(0).required()
      }
    }
  }
}, {
  path: '/api/auth/changepassword',
  method: 'POST',
  handler: AuthController.changePassword,
  config: {
    tags: ['api'],
    auth: 'token',
    description: 'Change user password with old password',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        old_password: Joi.string().min(MIN_PASSWORD_LENGTH).required(),
        new_password: Joi.string().min(MIN_PASSWORD_LENGTH).required(),
      }
    }
  }
}, {
  path: '/api/auth/verifyregistationotp',
  method: 'POST',
  handler: AuthController.VerifyRegistationOtp,
  config: {
    tags: ['api'],
    auth: 'token',
    description: 'Verify emai with verification code',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        otp: Joi.string().required(),
      }
    }
  }
}, {
  path: '/api/auth/resendotp',
  method: 'POST',
  handler: AuthController.resendOtp,
  config: {
    tags: ['api'],
    description: 'Resend otp via email',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        userId: Joi.number().integer().min(0).required()
      }
    }
  }
}, {
  path: '/api/auth/settings',
  method: 'POST',
  handler: AuthController.settings,
  config: {
    tags: ['api'],
    auth: 'token',
    description: 'User settings',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        unit: Joi.string().optional().description('Unit for messurment'),
        viewpoint: Joi.string().optional().description('viewpoint of user')
      }
    }
  }
}];
