'use strict';

/**
 * Module dependencies
 */
var branchesPolicy = require('../policies/branches.server.policy'),
  branches = require('../controllers/branches.server.controller');

module.exports = function(app) {
  // Branches Routes
  app.route('/api/branches').all(branchesPolicy.isAllowed)
    .get(branches.list)
    .post(branches.create);

  app.route('/api/branches/:branchId').all(branchesPolicy.isAllowed)
    .get(branches.read)
    .put(branches.update)
    .delete(branches.delete);

  // Finish by binding the Branch middleware
  app.param('branchId', branches.branchByID);
};
