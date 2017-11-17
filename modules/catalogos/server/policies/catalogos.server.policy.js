'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Catalogos Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'organism', 'adminOrganism'],
    allows: [{
      resources: '/api/catalogos',
      permissions: '*'
    }, {
      resources: '/api/catalogos/:catalogoId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'serviceUser', 'operator'],
    allows: [{
      resources: '/api/catalogos',
      permissions: ['get', 'post']
    }, {
      resources: '/api/catalogos/:catalogoId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/catalogos',
      permissions: ['get']
    }, {
      resources: '/api/catalogos/:catalogoId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Catalogos Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Catalogo is being processed and the current user created it then allow any manipulation
  if (req.catalogo && req.user && req.catalogo.user && req.catalogo.user.id === req.user.id) {
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
