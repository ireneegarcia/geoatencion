'use strict';

/**
 * Module dependencies
 */
var alarmasPolicy = require('../policies/alarmas.server.policy'),
  alarmas = require('../controllers/alarmas.server.controller');

module.exports = function(app) {
  // Alarmas Routes
  app.route('/api/alarmas').all(alarmasPolicy.isAllowed)
    .get(alarmas.list)
    .post(alarmas.create);

  app.route('/api/alarmas/:alarmaId').all(alarmasPolicy.isAllowed)
    .get(alarmas.read)
    .put(alarmas.update)
    .delete(alarmas.delete);

  // Finish by binding the Alarma middleware
  app.param('alarmaId', alarmas.alarmaByID);
};
