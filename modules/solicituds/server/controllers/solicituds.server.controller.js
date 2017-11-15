'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Solicitud = mongoose.model('affiliationRequest'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Solicitud
 */
exports.create = function(req, res) {
  var solicitud = new Solicitud(req.body);
  solicitud.user = req.user;

  solicitud.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(solicitud);
    }
  });
};

/**
 * Show the current Solicitud
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var solicitud = req.solicitud ? req.solicitud.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  solicitud.isCurrentUserOwner = req.user && solicitud.user && solicitud.user._id.toString() === req.user._id.toString();

  res.jsonp(solicitud);
};

/**
 * Update a Solicitud
 */
exports.update = function(req, res) {
  var solicitud = req.solicitud;

  solicitud = _.extend(solicitud, req.body);

  solicitud.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(solicitud);
    }
  });
};

/**
 * Delete an Solicitud
 */
exports.delete = function(req, res) {
  var solicitud = req.solicitud;

  solicitud.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(solicitud);
    }
  });
};

/**
 * List of Solicituds
 */
exports.list = function(req, res) {
  Solicitud.find().sort('-created').populate('user', 'displayName').exec(function(err, solicituds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(solicituds);
    }
  });
};

/**
 * Solicitud middleware
 */
exports.solicitudByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Solicitud is invalid'
    });
  }

  Solicitud.findById(id).populate('user', 'displayName').exec(function (err, solicitud) {
    if (err) {
      return next(err);
    } else if (!solicitud) {
      return res.status(404).send({
        message: 'No Solicitud with that identifier has been found'
      });
    }
    req.solicitud = solicitud;
    next();
  });
};
