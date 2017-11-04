'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Mails Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'organism', 'operator'],
    allows: [{
      resources: '/api/mails',
      permissions: '*'
    }, {
      resources: '/api/mails/:mailId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/mails',
      permissions: ['get', 'post']
    }, {
      resources: '/api/mails/:mailId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/mails',
      permissions: ['get']
    }, {
      resources: '/api/mails/:mailId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Mails Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Mail is being processed and the current user created it then allow any manipulation
  if (req.mail && req.user && req.mail.user && req.mail.user.id === req.user.id) {
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
