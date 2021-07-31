/* eslint-disable no-magic-numbers */
'use strict';

const Joi = require('joi');
const { AsyncAdapter: FloorNameController } = require('../controllers/FloorNameController');
const { reformatValidationOutput } = require('../utils');

 module.exports = [
  {
  path: '/api/floor_names',
  method: 'GET',
  handler: FloorNameController.list,
  config: {
    description: 'List floor_names',
    notes: 'Returns a list of floor_names',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      query: {
        page: Joi.number().integer().min(1).default(1),
        pageSize: Joi.number().integer().min(1).max(1000).default(50),
        name: Joi.string().optional(),
      }
    }
  }
}, 
{
  path: '/api/floor_names/create',
  method: 'POST',
  handler: FloorNameController.create,
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
      }
    }
  }
}
, {
  path: '/api/floor_names/{floorId}',
  method: 'GET',
  handler: FloorNameController.show,
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
  path: '/api/floor_names/{floorId}',
  method: 'PUT',
  handler: FloorNameController.update,
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
  path: '/api/floor_names/{floorId}',
  method: 'DELETE',
  handler: FloorNameController.destroy,
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
