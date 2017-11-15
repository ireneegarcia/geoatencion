'use strict';

/**
 * Module dependencies
 */
var organismsPolicy = require('../policies/organisms.server.policy'),
  organisms = require('../controllers/organisms.server.controller');

module.exports = function(app) {
  // Organisms Routes
  app.route('/api/organisms').all(organismsPolicy.isAllowed)
    .get(organisms.list)
    .post(organisms.create);

  app.route('/api/organisms/:organismId').all(organismsPolicy.isAllowed)
    .get(organisms.read)
    .put(organisms.update)
    .delete(organisms.delete);

  // Finish by binding the Organism middleware
  app.param('organismId', organisms.organismByID);
};
