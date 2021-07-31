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

class RoomNameController {
  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }
  static async create(request, h) {

    try {
      const { user: { id: userId, userType:userType } } = request.auth.credentials;
      request.payload.userId = userId
      request.payload.userType = userType
      let room_name = await authService.post('room_names/create', request.payload);
      if(room_name && room_name.data){
        return h.response(room_name.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }
  static async list(request, h) {

    //try {
      const { user: { id: userId } } = request.auth.credentials;
      const { page, pageSize, name } = request.query;

        const params = {
          page, pageSize, name
        };
      let room_name = await authService.get('room_names', {params});
      if(room_name && room_name.data){
        return h.response(room_name.data);
      }
      return h.response(room_name);
    // } catch (err) {
    //   return h.response(err.response);
    // }
  }
  static async update(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { roomNameId: roomNameId } = request.params;
      request.payload.data = JSON.stringify(request.payload.data)
      let room_name = await authService.put(`room_names/${roomNameId}`, request.payload);
      if(room_name && room_name.data){
        return h.response(room_name.data);
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
      const { roomNameId: roomNameId } = request.params;
      let room_name = await authService.get(`room_names/${roomNameId}`, request.payload);
      if(room_name && room_name.data){
        let room_names = room_name.data
        console.log(room_names)
        
        //room_names.data = JSON.parse(room_names.data)
        return h.response(room_names);
       
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
      const { roomNameId: roomNameId } = request.params;
      let room_name = await authService.delete(`room_names/${roomNameId}`, request.payload);
      if(room_name && room_name.data){
        return h.response(room_name.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }

}


module.exports = RoomNameController;
