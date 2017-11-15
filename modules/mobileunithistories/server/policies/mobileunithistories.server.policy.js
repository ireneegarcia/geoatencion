'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Mobileunithistories Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/mobileunithistories',
      permissions: '*'
    }, {
      resources: '/api/mobileunithistories/:mobileunithistoryId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'guest'],
    allows: [{
      resources: '/api/mobileunithistories',
      permissions: ['get', 'post']
    }, {
      resources: '/api/mobileunithistories/:mobileunithistoryId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/mobileunithistories',
      permissions: ['get']
    }, {
      resources: '/api/mobileunithistories/:mobileunithistoryId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Mobileunithistories Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Mobileunithistory is being processed and the current user created it then allow any manipulation
  if (req.mobileunithistory && req.user && req.mobileunithistory.user && req.mobileunithistory.user.id === req.user.id) {
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
