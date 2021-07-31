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

class FloorNameController {
  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }
  static async create(request, h) {

    try {
      const { user: { id: userId, userType:userType } } = request.auth.credentials;
      request.payload.userId = userId
      request.payload.userType = userType
      console.log('public')
      console.log(request.payload)
      let floor = await authService.post('floor_names/create', request.payload);
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
      const { page, pageSize, name } = request.query;

    const params = {
      page, pageSize, name
    };
      let floor = await authService.get('floor_names', {params});
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
      let floor = await authService.put(`floor_names/${floorId}`, request.payload);
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
      let floor = await authService.get(`floor_names/${floorId}`, request.payload);
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
      let floor = await authService.delete(`floor_names/${floorId}`, request.payload);
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


module.exports = FloorNameController;
