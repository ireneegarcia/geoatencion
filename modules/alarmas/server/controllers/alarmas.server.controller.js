'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Alarma = mongoose.model('Alarma'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Alarma
 */
exports.create = function(req, res) {
  var alarma = new Alarma(req.body);
  alarma.user = req.user;

  alarma.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarma);
    }
  });
};

/**
 * Show the current Alarma
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var alarma = req.alarma ? req.alarma.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  alarma.isCurrentUserOwner = req.user && alarma.user && alarma.user._id.toString() === req.user._id.toString();

  res.jsonp(alarma);
};

/**
 * Update a Alarma
 */
exports.update = function(req, res) {
  var alarma = req.alarma;

  alarma = _.extend(alarma, req.body);

  alarma.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarma);
    }
  });
};

/**
 * Delete an Alarma
 */
exports.delete = function(req, res) {
  var alarma = req.alarma;

  alarma.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarma);
    }
  });
};

/**
 * List of Alarmas
 */
exports.list = function(req, res) {
  Alarma.find().sort('-created').populate('user', 'displayName').exec(function(err, alarmas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarmas);
    }
  });
};

/**
 * Alarma middleware
 */
exports.alarmaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Alarma is invalid'
    });
  }

  Alarma.findById(id).populate('user', 'displayName').exec(function (err, alarma) {
    if (err) {
      return next(err);
    } else if (!alarma) {
      return res.status(404).send({
        message: 'No Alarma with that identifier has been found'
      });
    }
    req.alarma = alarma;
    next();
  });
};
