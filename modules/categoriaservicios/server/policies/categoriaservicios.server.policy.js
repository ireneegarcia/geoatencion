'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Categoriaservicios Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/categoriaservicios',
      permissions: '*'
    }, {
      resources: '/api/categoriaservicios/:categoriaservicioId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'guest', 'serviceUser', 'operator'],
    allows: [{
      resources: '/api/categoriaservicios',
      permissions: ['get', 'post']
    }, {
      resources: '/api/categoriaservicios/:categoriaservicioId',
      permissions: ['get']
    }]
  }, {
    roles: ['organism', 'adminOrganism'],
    allows: [{
      resources: '/api/categoriaservicios',
      permissions: ['get', 'post']
    }, {
      resources: '/api/categoriaservicios/:categoriaservicioId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Categoriaservicios Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Categoriaservicio is being processed and the current user created it then allow any manipulation
  if (req.categoriaservicio && req.user && req.categoriaservicio.user && req.categoriaservicio.user.id === req.user.id) {
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
