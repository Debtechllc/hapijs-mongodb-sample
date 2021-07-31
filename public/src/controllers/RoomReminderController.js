/* eslint-disable camelcase */
/* eslint-disable complexity */
'use strict';

const { AsyncAdapter, authService } = require('../utils');
const asyncInterface = [
  'create',
  'list',
  'show',
  'update',
  'destroy'
];

class RoomReminderController {
  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }

  static async create(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      request.payload.userId = userId;
      const room_ = await authService.get(`rooms/${request.payload.roomId}`);
      let floorId
      if (room_ && room_.data) {
        floorId = room_.data.floorId;
        
      }
      let floor_ = await authService.get(`floors/${floorId}`);
      if (floor_ && floor_.data) {
        request.payload.projectId = floor_.data.projectId;
      }


      const room_reminder = await authService.post('room_reminders/create', request.payload);
      if (room_reminder && room_reminder.data) {
        return h.response(room_reminder.data);
      }


    } catch (err) {
      if (err && err.response.data) {
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }
  static async list(request, h) {

    // try {
    const { user: { id: userId } } = request.auth.credentials;
    const { page, pageSize, name, floorId, projectId } = request.query;

    const params = {
      page, pageSize, name,
      floorId, projectId
    };
    const roomReminder = await authService.get('room_reminders', { params });
    if (roomReminder && roomReminder.data) {
      return h.response(roomReminder.data);
    }
    return h.response(roomReminder);
    // } catch (err) {
    //   return h.response(err.response);
    // }
  }
  
  static async update(request, h) {

    try {
      const { roomReminderId } = request.params;
      const roomReminder = await authService.post(`room_reminders/${roomReminderId}`, request.payload);
      if (roomReminder && roomReminder.data) {
        return h.response(roomReminder.data);
      }


    } catch (err) {
      if (err && err.response.data) {
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }


  static async show(request, h) {

    // try {
    const { user: { id: userId } } = request.auth.credentials;
    const { roomReminderId } = request.params;
    const room_reminder = await authService.get(`room_reminders/${roomReminderId}`, request.payload);
    if (room_reminder && room_reminder.data) {
      const room_reminders = room_reminder.data;
      return h.response(room_reminders);
    }


    // } catch (err) {
    //   if(err && err.response && err.response.data){
    //     return h.response(err.response.data);
    //   }
    //   return h.response(err.response);

    // }
  }
  static async destroy(request, h) {

    try {
      const { roomReminderId } = request.params;
      const room_reminder = await authService.delete(`room_reminders/${roomReminderId}`, request.payload);
      if (room_reminder && room_reminder.data) {
        return h.response(room_reminder.data);
      }


    } catch (err) {
      if (err && err.response.data) {
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }

}


module.exports = RoomReminderController;
