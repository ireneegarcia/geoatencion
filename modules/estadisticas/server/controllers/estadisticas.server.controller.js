'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Estadistica = mongoose.model('Estadistica'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Estadistica
 */
exports.create = function(req, res) {
  var estadistica = new Estadistica(req.body);
  estadistica.user = req.user;

  estadistica.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estadistica);
    }
  });
};

/**
 * Show the current Estadistica
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var estadistica = req.estadistica ? req.estadistica.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  estadistica.isCurrentUserOwner = req.user && estadistica.user && estadistica.user._id.toString() === req.user._id.toString();

  res.jsonp(estadistica);
};

/**
 * Update a Estadistica
 */
exports.update = function(req, res) {
  var estadistica = req.estadistica;

  estadistica = _.extend(estadistica, req.body);

  estadistica.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estadistica);
    }
  });
};

/**
 * Delete an Estadistica
 */
exports.delete = function(req, res) {
  var estadistica = req.estadistica;

  estadistica.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estadistica);
    }
  });
};

/**
 * List of Estadisticas
 */
exports.list = function(req, res) {
  Estadistica.find().sort('-created').populate('user', 'displayName').exec(function(err, estadisticas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estadisticas);
    }
  });
};

/**
 * Estadistica middleware
 */
exports.estadisticaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Estadistica is invalid'
    });
  }

  Estadistica.findById(id).populate('user', 'displayName').exec(function (err, estadistica) {
    if (err) {
      return next(err);
    } else if (!estadistica) {
      return res.status(404).send({
        message: 'No Estadistica with that identifier has been found'
      });
    }
    req.estadistica = estadistica;
    next();
  });
};
