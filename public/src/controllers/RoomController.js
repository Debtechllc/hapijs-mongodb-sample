/* eslint-disable complexity */
'use strict';

const { AsyncAdapter, JWTAuth, authService, AwsS3 } = require('../utils');
const Boom = require('boom');
const asyncInterface = [
  'create',
  'list',
  'show',
  'update',
  'destroy',
  'IsJsonString',
  'uploadphoto'
];
const path = require('path');
const {
  AWS_S3_IMAGE_KEY_TEMPLATE,
  AWS_S3_BUCKET_NAME
} = process.env;

const templates = {
  image: {
    key: AWS_S3_IMAGE_KEY_TEMPLATE
  }
};

class RoomController {
  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }
  
  static async create(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      //request.payload.userId = userId
      request.payload.data = JSON.stringify(request.payload.data)
      request.payload.floorPosition = JSON.stringify(request.payload.floorPosition)
      request.payload.walls = JSON.stringify(request.payload.walls)
      request.payload.points = JSON.stringify(request.payload.points)
      request.payload.attachedComponents = JSON.stringify(request.payload.attachedComponents)
      let room = await authService.post('rooms/create', request.payload);
      if(room && room.data){
        return h.response(room.data);
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
      const { page, pageSize, name, floorId } = request.query;

        const params = {
          page, pageSize, name, 
          floorId
        };
      let room = await authService.get('rooms', {params});
      if(room && room.data){
          let det = room.data
          let items = det.items
          let rooms = items.map((item) => {
            let isvalid =  this.IsJsonString(item.data);
            if(isvalid){
                item.data = JSON.parse(item.data)
                item.floorPosition = item.floorPosition ? JSON.parse(item.floorPosition) : 
                {}
                item.walls = item.walls ? JSON.parse(item.walls) : {}
                item.points = item.points ? JSON.parse(item.points) : {}
                item.attachedComponents = item.attachedComponents ? JSON.parse(item.attachedComponents) : {}
            }
            
          return item;
        })
        det.items = rooms
         
         return h.response(det);
        return h.response(room.data);
      }
      return h.response(room);
    // } catch (err) {
    //   return h.response(err.response);
    // }
  }
  static  IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }
  static async update(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { roomId: roomId } = request.params;
      request.payload.data = JSON.stringify(request.payload.data)
      // request.payload.floorPosition = JSON.stringify(request.payload.floorPosition)
      // request.payload.walls = JSON.stringify(request.payload.walls)
      // request.payload.points = JSON.stringify(request.payload.points)
      // request.payload.attachedComponents = JSON.stringify(request.payload.attachedComponents)
      
      let room = await authService.post(`rooms/${roomId}`, request.payload);
      if(room && room.data){
        return h.response(room.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }
  

  static async uploadphoto(request, h) {

    try {
      const { user: { id: userId } } = request.auth.credentials;
      const { roomId: roomId } = request.params;
      const { file } = request.payload;
      //return h.response(request.payload);
      let image = ''

      const template = templates['image'];

        const extension = path.extname(file.hapi.filename);
        const key = template.key.replace('@@filename', `${roomId}${extension}`);
        console.log(key)
        await AwsS3.s3UploadStream(key, file);
        image = 'https://'+AWS_S3_BUCKET_NAME+'.s3.amazonaws.com/images/'+roomId+extension;
      //console.log('image', image)
      request.payload.image = image
      let room = await authService.post(`rooms/${roomId}`, {image: image});
      if(room && room.data){
        return h.response(room.data);
      }
      
       
    } catch (err) {
      console.log('errrr')
      console.log(err)
      //return h.response(err);
      if(err && err.response && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }
  static async show(request, h) {

    //try {
      const { user: { id: userId } } = request.auth.credentials;
      const { roomId: roomId } = request.params;
      let room = await authService.get(`rooms/${roomId}`, request.payload);
      if(room && room.data){
        let rooms = room.data
        let isvalid =  this.IsJsonString(rooms.data);
        console.log(rooms)
        rooms.data = JSON.parse(rooms.data)
            if(isvalid){
                //rooms.data = JSON.parse(rooms.data)
                console.log('rooms'+ isvalid)
            }
          rooms.floorPosition = rooms.floorPosition ? JSON.parse(rooms.floorPosition) : 
                {}
            //rooms.floorPosition = JSON.parse(rooms.floorPosition)
        rooms.walls = rooms.walls ? JSON.parse(rooms.walls) : {}
        //rooms.points = this.IsJsonString(rooms.points) ? JSON.parse(rooms.points) : {}
        rooms.points = rooms.points ? JSON.parse(rooms.points) : {}

        rooms.attachedComponents = rooms.attachedComponents ? JSON.parse(rooms.attachedComponents) : {}
        //rooms.data = JSON.parse(rooms.data)
        return h.response(rooms);
       
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
      const { user: { id: userId } } = request.auth.credentials;
      const { roomId: roomId } = request.params;
      let room = await authService.delete(`rooms/${roomId}`, request.payload);
      if(room && room.data){
        return h.response(room.data);
      }
      
       
    } catch (err) {
      if(err && err.response.data){
        return h.response(err.response.data);
      }
      return h.response(err.response);

    }
  }

}


module.exports = RoomController;
