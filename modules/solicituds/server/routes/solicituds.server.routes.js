'use strict';

/**
 * Module dependencies
 */
var solicitudsPolicy = require('../policies/solicituds.server.policy'),
  solicituds = require('../controllers/solicituds.server.controller');

module.exports = function(app) {
  // Solicituds Routes
  app.route('/api/solicituds').all(solicitudsPolicy.isAllowed)
    .get(solicituds.list)
    .post(solicituds.create);

  app.route('/api/solicituds/:solicitudId').all(solicitudsPolicy.isAllowed)
    .get(solicituds.read)
    .put(solicituds.update)
    .delete(solicituds.delete);

  // Finish by binding the Solicitud middleware
  app.param('solicitudId', solicituds.solicitudByID);
};
