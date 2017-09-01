'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Panels Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'organism', 'operator'],
    allows: [{
      resources: '/api/panels',
      permissions: '*'
    }, {
      resources: '/api/panels/:panelId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/panels',
      permissions: ['get', 'post']
    }, {
      resources: '/api/panels/:panelId',
      permissions: ['get']
    }]
  }, {
    roles: ['organism'],
    allows: [{
      resources: '/api/panels',
      permissions: ['get', 'post']
    }, {
      resources: '/api/panels/:panelId',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/panels',
      permissions: ['get']
    }, {
      resources: '/api/panels/:panelId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Panels Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Panel is being processed and the current user created it then allow any manipulation
  if (req.panel && req.user && req.panel.user && req.panel.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
