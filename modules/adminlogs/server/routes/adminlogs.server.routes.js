'use strict';

/**
 * Module dependencies
 */
var adminlogsPolicy = require('../policies/adminlogs.server.policy'),
  adminlogs = require('../controllers/adminlogs.server.controller');

module.exports = function(app) {
  // Adminlogs Routes
  app.route('/api/adminlogs').all(adminlogsPolicy.isAllowed)
    .get(adminlogs.list)
    .post(adminlogs.create);

  app.route('/api/adminlogs/:adminlogId').all(adminlogsPolicy.isAllowed)
    .get(adminlogs.read)
    .put(adminlogs.update)
    .delete(adminlogs.delete);

  // Finish by binding the Adminlog middleware
  app.param('adminlogId', adminlogs.adminlogByID);
};
