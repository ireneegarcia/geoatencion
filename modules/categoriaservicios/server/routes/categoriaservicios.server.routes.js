'use strict';

/**
 * Module dependencies
 */
var categoriaserviciosPolicy = require('../policies/categoriaservicios.server.policy'),
  categoriaservicios = require('../controllers/categoriaservicios.server.controller');

module.exports = function(app) {
  // Categoriaservicios Routes
  app.route('/api/categoriaservicios').all(categoriaserviciosPolicy.isAllowed)
    .get(categoriaservicios.list)
    .post(categoriaservicios.create);

  app.route('/api/categoriaservicios/:categoriaservicioId').all(categoriaserviciosPolicy.isAllowed)
    .get(categoriaservicios.read)
    .put(categoriaservicios.update)
    .delete(categoriaservicios.delete)
    .post(categoriaservicios.setIcon);

  // Finish by binding the Categoriaservicio middleware
  app.param('categoriaservicioId', categoriaservicios.categoriaservicioByID);
};
