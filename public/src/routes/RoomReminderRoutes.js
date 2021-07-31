/* eslint-disable no-magic-numbers */
'use strict';

const Joi = require('joi');
const { AsyncAdapter: RoomReminderController } = require('../controllers/RoomReminderController');
const { reformatValidationOutput } = require('../utils');
module.exports = [
  {
    path: '/api/room_reminders',
    method: 'GET',
    handler: RoomReminderController.list,
    config: {
      description: 'List room_reminders',
      notes: 'Returns a list of room_reminders',
      tags: ['api'],
      auth: 'token',
      validate: {
        options: { abortEarly: false },
        failAction: reformatValidationOutput,
        query: {
          page: Joi.number().integer().min(1).default(1),
          pageSize: Joi.number().integer().min(1).max(1000).default(50),
          name: Joi.string().optional(),
          roomId: Joi.string().optional().description('the room id for the reminder'),
          projectId: Joi.string().optional().description('the project id for the reminder')
        }
      }
    }
  },
  {
    path: '/api/room_reminders/create',
    method: 'POST',
    handler: RoomReminderController.create,
    config: {
      description: 'Create room reminder',
      notes: 'Creates a room reminder with the attributes provided in the request body',
      tags: ['api'],
      auth: 'token',
      validate: {
        options: { abortEarly: false },
        failAction: reformatValidationOutput,
        payload: {
          name: Joi.string().required().description('the  name for the room reminder'),
          roomId: Joi.string().description('the room id of the room reminder'),
          note: Joi.any().optional().description('the  note for the room reminder'),
          reminderdate: Joi.any().optional().description('the  reminderdate for the room reminder'),
          remindertime: Joi.any().optional().description('the  remindertime for the room reminder')
        }
      }
    }
  },
  {
    path: '/api/room_reminders/{roomReminderId}',
    method: 'GET',
    handler: RoomReminderController.show,
    config: {
      description: 'Get room reminder',
      notes: 'Returns a room reminder by the id in the path',
      tags: ['api'],
      auth: 'token',
      validate: {
        options: { abortEarly: false },
        failAction: reformatValidationOutput,
        params: {
          roomReminderId: Joi.string().required().min(0).description('the id for the room reminder')
        }
      }
    }
  }, {
    path: '/api/room_reminders/{roomReminderId}',
    method: 'POST',
    handler: RoomReminderController.update,
    config: {
      description: 'Update room reminder',
      notes: 'Updates a reminder by the id passed in the path with the attributes provided in the request body',
      tags: ['api'],
      auth: 'token',
      validate: {
        options: { abortEarly: false },
        failAction: reformatValidationOutput,
        params: {
          roomReminderId: Joi.string().required().min(0).description('the id for the room reminder')
        },
        payload: {
          name: Joi.string().required().description('the  name for the room reminder'),
          note: Joi.any().optional().description('the  note for the room reminder'),
          reminderdate: Joi.any().optional().description('the  reminderdate for the room reminder'),
          remindertime: Joi.any().optional().description('the  remindertime for the room reminder')
        }
      }
    }
  },
  {
    path: '/api/room_reminders/{roomReminderId}',
    method: 'DELETE',
    handler: RoomReminderController.destroy,
    config: {
      description: 'Delete room reminder',
      notes: 'Deletes a room reminder by the id passed in the path with the attributes provided in the request body',
      tags: ['api'],
      auth: 'token',
      validate: {
        options: { abortEarly: false },
        failAction: reformatValidationOutput,
        params: {
          roomReminderId: Joi.string().required().description('the id for the room reminder')
        }
      }
    }
  }
];
