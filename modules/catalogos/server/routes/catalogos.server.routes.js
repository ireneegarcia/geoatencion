'use strict';

/**
 * Module dependencies
 */
var catalogosPolicy = require('../policies/catalogos.server.policy'),
  catalogos = require('../controllers/catalogos.server.controller');

module.exports = function(app) {
  // Catalogos Routes
  app.route('/api/catalogos').all(catalogosPolicy.isAllowed)
    .get(catalogos.list)
    .post(catalogos.create);

  app.route('/api/catalogos/:catalogoId').all(catalogosPolicy.isAllowed)
    .get(catalogos.read)
    .put(catalogos.update)
    .delete(catalogos.delete);

  // Finish by binding the Catalogo middleware
  app.param('catalogoId', catalogos.catalogoByID);
};
