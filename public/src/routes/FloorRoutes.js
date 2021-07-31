/* eslint-disable no-magic-numbers */
'use strict';

const Joi = require('joi');
const { AsyncAdapter: FloorController } = require('../controllers/FloorController');
const { reformatValidationOutput } = require('../utils');

 module.exports = [
  {
  path: '/api/floors',
  method: 'GET',
  handler: FloorController.list,
  config: {
    description: 'List floors',
    notes: 'Returns a list of floors',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      query: {
        page: Joi.number().integer().min(1).default(1),
        pageSize: Joi.number().integer().min(1).max(1000).default(50),
        name: Joi.string().optional(),
        projectId: Joi.string().description('the project id of the floor')
      }
    }
  }
}, 
{
  path: '/api/floors/create',
  method: 'POST',
  handler: FloorController.create,
  config: {
    description: 'Create floor',
    notes: 'Creates a floor with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        name: Joi.string().required().description('the  name for the floor'),
        projectId: Joi.string().description('the project id of the floor')
      }
    }
  }
}
, {
  path: '/api/floors/{floorId}',
  method: 'GET',
  handler: FloorController.show,
  config: {
    description: 'Get floor',
    notes: 'Returns a floor by the id in the path',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        floorId: Joi.string().required().min(0).description('the id for the floor')
      }
    }
  }
}, {
  path: '/api/floors/{floorId}',
  method: 'PUT',
  handler: FloorController.update,
  config: {
    description: 'Update floor',
    notes: 'Updates a floor by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        floorId: Joi.string().required().min(0).description('the id for the floor')
      },
      payload: {
        name: Joi.string().required().description('the  name for the floor'),
      }
    }
  }
}, 
 {
  path: '/api/floors/{floorId}',
  method: 'DELETE',
  handler: FloorController.destroy,
  config: {
    description: 'Delete floor',
    notes: 'Deletes a floor by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        floorId: Joi.string().required().description('the id for the floor')
      }
    }
  }
 }
];
