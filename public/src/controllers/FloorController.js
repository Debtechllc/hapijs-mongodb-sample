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

class FloorController {
  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }
  static async create(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      //request.payload.userId = userId
      console.log('public')
      console.log(request.payload)
      let floor = await authService.post('floors/create', request.payload);
      if(floor && floor.data){
        return h.response(floor.data);
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
      const { page, pageSize, name, projectId } = request.query;

    const params = {
      page, pageSize, name, 
      projectId
    };
      let floor = await authService.get('floors', {params});
      if(floor && floor.data){
        return h.response(floor.data);
      }
      return h.response(floor);
    } catch (err) {
      return h.response(err.response);
    }
  }
  static async update(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { floorId: floorId } = request.params;
      let floor = await authService.put(`floors/${floorId}`, request.payload);
      if(floor && floor.data){
        return h.response(floor.data);
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
      const { floorId: floorId } = request.params;
      let floor = await authService.get(`floors/${floorId}`, request.payload);
      if(floor && floor.data){
        return h.response(floor.data);
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
      const { floorId: floorId } = request.params;
      let floor = await authService.delete(`floors/${floorId}`, request.payload);
      if(floor && floor.data){
        return h.response(floor.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }

}


module.exports = FloorController;
