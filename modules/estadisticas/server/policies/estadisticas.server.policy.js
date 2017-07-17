'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Estadisticas Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/estadisticas',
      permissions: '*'
    }, {
      resources: '/api/estadisticas/:estadisticaId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/estadisticas',
      permissions: ['get', 'post']
    }, {
      resources: '/api/estadisticas/:estadisticaId',
      permissions: ['get']
    }]
  }, {
    roles: ['organism'],
    allows: [{
      resources: '/api/estadisticas',
      permissions: ['get', 'post']
    }, {
      resources: '/api/estadisticas/:estadisticaId',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/estadisticas',
      permissions: ['get']
    }, {
      resources: '/api/estadisticas/:estadisticaId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Estadisticas Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Estadistica is being processed and the current user created it then allow any manipulation
  if (req.estadistica && req.user && req.estadistica.user && req.estadistica.user.id === req.user.id) {
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
