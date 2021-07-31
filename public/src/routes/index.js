'use strict';

const { flatten } = require('lodash');

const HealthRoutes = require('./HealthRoutes');
const AuthRoutes = require('./AuthRoutes');
const ProjectRoutes = require('./ProjectRoutes');
const FloorRoutes = require('./FloorRoutes');
const FloorNameRoutes = require('./FloorNameRoutes');
const RoomRoutes = require('./RoomRoutes');
const RoomNameRoutes = require('./RoomNameRoutes');
const RoomReminderRoutes = require('./RoomReminderRoutes');

module.exports = flatten([
  HealthRoutes,
  AuthRoutes,
  ProjectRoutes,
  FloorRoutes,
  FloorNameRoutes,
  RoomNameRoutes,
  RoomRoutes,
  RoomReminderRoutes
  
]);
