'use strict';

/**
 * Module dependencies
 */
var estadisticasPolicy = require('../policies/estadisticas.server.policy'),
  estadisticas = require('../controllers/estadisticas.server.controller');

module.exports = function(app) {
  // Estadisticas Routes
  app.route('/api/estadisticas').all(estadisticasPolicy.isAllowed)
    .get(estadisticas.list)
    .post(estadisticas.create);

  app.route('/api/estadisticas/:estadisticaId').all(estadisticasPolicy.isAllowed)
    .get(estadisticas.read)
    .put(estadisticas.update)
    .delete(estadisticas.delete);

  // Finish by binding the Estadistica middleware
  app.param('estadisticaId', estadisticas.estadisticaByID);
};
