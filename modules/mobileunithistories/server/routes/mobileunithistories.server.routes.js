'use strict';

/**
 * Module dependencies
 */
var mobileunithistoriesPolicy = require('../policies/mobileunithistories.server.policy'),
  mobileunithistories = require('../controllers/mobileunithistories.server.controller');

module.exports = function(app) {
  // Mobileunithistories Routes
  app.route('/api/mobileunithistories').all(mobileunithistoriesPolicy.isAllowed)
    .get(mobileunithistories.list)
    .post(mobileunithistories.create);

  app.route('/api/mobileunithistories/:mobileunithistoryId').all(mobileunithistoriesPolicy.isAllowed)
    .get(mobileunithistories.read)
    .put(mobileunithistories.update)
    .delete(mobileunithistories.delete);

  // Finish by binding the Mobileunithistory middleware
  app.param('mobileunithistoryId', mobileunithistories.mobileunithistoryByID);
};
