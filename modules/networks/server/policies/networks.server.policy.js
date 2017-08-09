'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Networks Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['organism'],
    allows: [{
      resources: '/api/networks',
      permissions: '*'
    }, {
      resources: '/api/networks/:networkId',
      permissions: '*'
    }]
  }, {
    roles: ['organism'],
    allows: [{
      resources: '/api/networks',
      permissions: ['get', 'post']
    }, {
      resources: '/api/networks/:networkId',
      permissions: ['get']
    }]
  }, {
    roles: ['user', 'guest', 'admin', 'serviceUser', 'operator'],
    allows: [{
      resources: '/api/networks',
      permissions: ['get']
    }, {
      resources: '/api/networks/:networkId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Networks Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Network is being processed and the current user created it then allow any manipulation
  if (req.network && req.user && req.network.user && req.network.user.id === req.user.id) {
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
