/* eslint-disable no-magic-numbers */
'use strict';

const Joi = require('joi');
const { AsyncAdapter: RoomNameController } = require('../controllers/RoomNameController');
const { reformatValidationOutput } = require('../utils');

 module.exports = [
  {
  path: '/api/room_names',
  method: 'GET',
  handler: RoomNameController.list,
  config: {
    description: 'List room_names',
    notes: 'Returns a list of room_names',
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
  path: '/api/room_names/create',
  method: 'POST',
  handler: RoomNameController.create,
  config: {
    description: 'Create room_name',
    notes: 'Creates a room_name with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        name: Joi.string().required().description('the  name for the room_name'),
      }
    }
  }
}
, {
  path: '/api/room_names/{roomNameId}',
  method: 'GET',
  handler: RoomNameController.show,
  config: {
    description: 'Get room_name',
    notes: 'Returns a room_name by the id in the path',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        roomNameId: Joi.string().required().min(0).description('the id for the room_name')
      }
    }
  }
}, {
  path: '/api/room_names/{roomNameId}',
  method: 'PUT',
  handler: RoomNameController.update,
  config: {
    description: 'Update room_name',
    notes: 'Updates a room_name by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        roomNameId: Joi.string().required().min(0).description('the id for the room_name')
      },
      payload: {
        name: Joi.string().required().description('the  name for the room_name'),
      }
    }
  }
}, 
 {
  path: '/api/room_names/{roomNameId}',
  method: 'DELETE',
  handler: RoomNameController.destroy,
  config: {
    description: 'Delete room_name',
    notes: 'Deletes a room_name by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        roomNameId: Joi.string().required().description('the id for the room_name')
      }
    }
  }
 }
];
