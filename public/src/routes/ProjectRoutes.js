/* eslint-disable no-magic-numbers */
'use strict';

const Joi = require('joi');
const { AsyncAdapter: ProjectController } = require('../controllers/ProjectController');
const { reformatValidationOutput } = require('../utils');

 module.exports = [
  {
  path: '/api/projects',
  method: 'GET',
  handler: ProjectController.list,
  config: {
    description: 'List projects',
    notes: 'Returns a list of projects',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      query: {
        page: Joi.number().integer().min(1).default(1),
        pageSize: Joi.number().integer().min(1).max(1000).default(50),
        projectname: Joi.string().optional()
      }
    }
  }
}, 
{
  path: '/api/projects/create',
  method: 'POST',
  handler: ProjectController.create,
  config: {
    description: 'Create project',
    notes: 'Creates a project with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        name: Joi.string().required().description('the  name for the project'),
        address: Joi.string().optional().allow('').description('the address is for project'),
        projectType: Joi.string().valid('Recidential', 'Commercial').optional().default('Recidential').description('the project type'),
        projectFor: Joi.string().valid('Me', 'Friend','Client','Family').optional().default('Me').description('the project is for'),
        highlights: Joi.string().optional().allow('').description('the highlights for the project'),
        note: Joi.string().optional().allow('').description('the note for the project'),
        goal: Joi.string().optional().allow('').description('the goal for the project'),
        roomNames: Joi.string().optional().allow('').description('the room names for the project'),
        data: Joi.string().optional().allow('').description('the data for the project')
      }
    }
  }
}
, {
  path: '/api/projects/{projectId}',
  method: 'GET',
  handler: ProjectController.show,
  config: {
    description: 'Get project',
    notes: 'Returns a project by the id in the path',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        projectId: Joi.string().required().min(0).description('the id for the project')
      }
    }
  }
}, {
  path: '/api/projects/{projectId}',
  method: 'PUT',
  handler: ProjectController.update,
  config: {
    description: 'Update project',
    notes: 'Updates a project by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        projectId: Joi.string().required().min(0).description('the id for the project')
      },
      payload: {
        name: Joi.string().required().description('the  name for the project'),
        projectFor: Joi.string().valid('Me', 'Friend','Client','Family').optional().default('Me').description('the project is for'),
        highlights: Joi.string().optional().allow('').description('the highlights for the project'),
        note: Joi.string().optional().allow('').description('the note for the project'),
        goal: Joi.string().optional().allow('').description('the goal for the project'),
      }
    }
  }
}, 
 {
  path: '/api/projects/{projectId}',
  method: 'DELETE',
  handler: ProjectController.destroy,
  config: {
    description: 'Delete project',
    notes: 'Deletes a project by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    auth: 'token',
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        projectId: Joi.string().required().description('the id for the project')
      }
    }
  }
 }
];
