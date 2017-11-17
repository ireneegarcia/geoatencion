'use strict';

/**
 * Module dependencies
 */
var mobileunitlogsPolicy = require('../policies/mobileunitlogs.server.policy'),
  mobileunitlogs = require('../controllers/mobileunitlogs.server.controller');

module.exports = function(app) {
  // Mobileunitlogs Routes
  app.route('/api/mobileunitlogs').all(mobileunitlogsPolicy.isAllowed)
    .get(mobileunitlogs.list)
    .post(mobileunitlogs.create);

  app.route('/api/mobileunitlogs/:mobileunitlogId').all(mobileunitlogsPolicy.isAllowed)
    .get(mobileunitlogs.read)
    .put(mobileunitlogs.update)
    .delete(mobileunitlogs.delete);

  // Finish by binding the Mobileunitlog middleware
  app.param('mobileunitlogId', mobileunitlogs.mobileunitlogByID);
};
