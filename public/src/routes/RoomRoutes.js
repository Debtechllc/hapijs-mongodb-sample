/* eslint-disable no-magic-numbers */
'use strict';

const Joi = require('joi');
const { AsyncAdapter: RoomController } = require('../controllers/RoomController');
const { reformatValidationOutput } = require('../utils');
const { Readable } = require('stream');
 module.exports = [
  {
  path: '/api/rooms',
  method: 'GET',
  handler: RoomController.list,
  config: {
    description: 'List rooms',
    notes: 'Returns a list of rooms',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      query: {
        page: Joi.number().integer().min(1).default(1),
        pageSize: Joi.number().integer().min(1).max(1000).default(50),
        name: Joi.string().optional(),
        floorId: Joi.string().optional().description('the floor id for the room')   
      }
    }
  }
}, 
{
  path: '/api/rooms/create',
  method: 'POST',
  handler: RoomController.create,
  config: {
    description: 'Create room',
    notes: 'Creates a room with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        name: Joi.string().required().description('the  name for the room'),
        floorId: Joi.string().description('the project id of the room'),
        data: Joi.any().optional().description('the  data for the room'),
        floorPosition: Joi.any().optional().description('the  floorPosition for the room'),
        walls: Joi.any().optional().description('the  walls for the room'),
        points: Joi.any().optional().description('the  points for the room'),
        attachedComponents: Joi.any().optional().description('the  attachedComponents for the room'),
      }
    }
  }
}
, {
  path: '/api/rooms/{roomId}',
  method: 'GET',
  handler: RoomController.show,
  config: {
    description: 'Get room',
    notes: 'Returns a room by the id in the path',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        roomId: Joi.string().required().min(0).description('the id for the room')
      }
    }
  }
}, {
  path: '/api/rooms/{roomId}',
  method: 'POST',
  handler: RoomController.update,
  config: {
    description: 'Update room',
    notes: 'Updates a room by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        roomId: Joi.string().required().min(0).description('the id for the room')
      },
      payload: {
        name: Joi.any().required().description('the  name for the room'),
        data: Joi.any().optional().description('the  data for the room'),
        floorPosition: Joi.any().optional().description('the  floorPosition for the room'),
        walls: Joi.any().optional().description('the  walls for the room'),
        points: Joi.any().optional().description('the  points for the room'),
        attachedComponents: Joi.any().optional().description('the  attachedComponents for the room'),
      }
    }
  }
}, 
 {
  path: '/api/rooms/{roomId}',
  method: 'DELETE',
  handler: RoomController.destroy,
  config: {
    description: 'Delete room',
    notes: 'Deletes a room by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        roomId: Joi.string().required().description('the id for the room')
      }
    }
  }
 }, {
  path: '/api/rooms/uploadphoto/{roomId}',
  method: 'POST',
  handler: RoomController.uploadphoto,
  config: {
    description: 'Update room',
    notes: 'Updates a room by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    payload: {
      allow: 'multipart/form-data',
      output: 'stream',
      maxBytes: 104857600,
      timeout: 180000,
      parse: true
    },
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        roomId: Joi.string().required().min(0).description('the id for the room')
      },
      payload: {
        file: Joi.object().required(),
      }
    }
  }
}
];
