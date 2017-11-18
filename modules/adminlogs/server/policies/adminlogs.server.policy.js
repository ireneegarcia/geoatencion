'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Adminlogs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/adminlogs',
      permissions: '*'
    }, {
      resources: '/api/adminlogs/:adminlogId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'adminOrganism'],
    allows: [{
      resources: '/api/adminlogs',
      permissions: ['get', 'post']
    }, {
      resources: '/api/adminlogs/:adminlogId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/adminlogs',
      permissions: ['get']
    }, {
      resources: '/api/adminlogs/:adminlogId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Adminlogs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Adminlog is being processed and the current user created it then allow any manipulation
  if (req.adminlog && req.user && req.adminlog.user && req.adminlog.user.id === req.user.id) {
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
