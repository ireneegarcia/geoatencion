'use strict';

/**
 * Module dependencies
 */
var alarmsPolicy = require('../policies/alarms.server.policy'),
  alarms = require('../controllers/alarms.server.controller');

module.exports = function(app) {
  // Alarms Routes
  app.route('/api/alarms').all(alarmsPolicy.isAllowed)
    .get(alarms.list)
    .post(alarms.create);

  app.route('/api/alarms/:alarmId').all(alarmsPolicy.isAllowed)
    .get(alarms.read)
    .put(alarms.update)
    .delete(alarms.delete);

  // Finish by binding the Alarm middleware
  app.param('alarmId', alarms.alarmByID);
};
