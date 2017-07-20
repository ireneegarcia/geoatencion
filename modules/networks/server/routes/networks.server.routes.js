'use strict';

/**
 * Module dependencies
 */
var networksPolicy = require('../policies/networks.server.policy'),
  networks = require('../controllers/networks.server.controller');

module.exports = function(app) {
  // Networks Routes
  app.route('/api/networks').all(networksPolicy.isAllowed)
    .get(networks.list)
    .post(networks.create);

  app.route('/api/networks/:networkId').all(networksPolicy.isAllowed)
    .get(networks.read)
    .put(networks.update)
    .delete(networks.delete);

  // Finish by binding the Network middleware
  app.param('networkId', networks.networkByID);
};
