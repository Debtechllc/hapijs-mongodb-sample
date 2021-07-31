'use strict';

const { AsyncAdapter, JWTAuth, authService } = require('../utils');

const Boom = require('boom');
const asyncInterface = [
  'create',
  'list',
  'show',
  'update',
  'destroy'
];

class ProjectController {
  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }
  static async create(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      request.payload.userId = userId
      let project = await authService.post('projects/create', request.payload);
      if(project && project.data){
        return h.response(project.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }
  static async list(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { page, pageSize, projectname } = request.query;

    const params = {
      page, pageSize, projectname, 
      userId
    };
      let project = await authService.get('projects', {params});
      if(project && project.data){
        return h.response(project.data);
      }
      return h.response(project);
    } catch (err) {
      return h.response(err.response);
    }
  }
  static async update(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { projectId: projectId } = request.params;
      let project = await authService.put(`projects/${projectId}`, request.payload);
      if(project && project.data){
        return h.response(project.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }
  static async show(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { projectId: projectId } = request.params;
      let project = await authService.get(`projects/${projectId}`, request.payload);
      if(project && project.data){
        return h.response(project.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }
  static async destroy(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { projectId: projectId } = request.params;
      let project = await authService.delete(`projects/${projectId}`, request.payload);
      if(project && project.data){
        return h.response(project.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }

}


module.exports = ProjectController;
