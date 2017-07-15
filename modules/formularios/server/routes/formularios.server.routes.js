'use strict';

/**
 * Module dependencies
 */
var formulariosPolicy = require('../policies/formularios.server.policy'),
  formularios = require('../controllers/formularios.server.controller');

module.exports = function(app) {
  // Formularios Routes
  app.route('/api/formularios').all(formulariosPolicy.isAllowed)
    .get(formularios.list)
    .post(formularios.create);

  app.route('/api/formularios/:formularioId').all(formulariosPolicy.isAllowed)
    .get(formularios.read)
    .put(formularios.update)
    .delete(formularios.delete);

  // Finish by binding the Formulario middleware
  app.param('formularioId', formularios.formularioByID);
};
