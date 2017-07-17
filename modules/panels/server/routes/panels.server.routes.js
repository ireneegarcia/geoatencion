'use strict';

/**
 * Module dependencies
 */
var panelsPolicy = require('../policies/panels.server.policy'),
  panels = require('../controllers/panels.server.controller');

module.exports = function(app) {
  // Panels Routes
  app.route('/api/panels').all(panelsPolicy.isAllowed)
    .get(panels.list)
    .post(panels.create);

  app.route('/api/panels/:panelId').all(panelsPolicy.isAllowed)
    .get(panels.read)
    .put(panels.update)
    .delete(panels.delete);

  // Finish by binding the Panel middleware
  app.param('panelId', panels.panelByID);
};
