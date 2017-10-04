'use strict';

/**
 * Module dependencies
 */
var firebasetokensPolicy = require('../policies/firebasetokens.server.policy'),
  firebasetokens = require('../controllers/firebasetokens.server.controller');

module.exports = function(app) {
  // Firebasetokens Routes
  app.route('/api/firebasetokens').all(firebasetokensPolicy.isAllowed)
    .get(firebasetokens.list)
    .post(firebasetokens.create);

  app.route('/api/firebasetokens/:firebasetokenId').all(firebasetokensPolicy.isAllowed)
    .get(firebasetokens.read)
    .put(firebasetokens.update)
    .delete(firebasetokens.delete);

  // Finish by binding the Firebasetoken middleware
  app.param('firebasetokenId', firebasetokens.firebasetokenByID);
};
