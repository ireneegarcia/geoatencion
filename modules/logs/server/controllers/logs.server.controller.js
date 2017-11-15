'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Log = mongoose.model('serviceRequestLog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Log
 */
exports.create = function(req, res) {
  var log = new Log(req.body);
  // log.user = req.user;
  log.user = req.body.user;

  log.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(log);
    }
  });
};

/**
 * Show the current Log
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var log = req.log ? req.log.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  log.isCurrentUserOwner = req.user && log.user && log.user._id.toString() === req.user._id.toString();

  res.jsonp(log);
};

/**
 * Update a Log
 */
exports.update = function(req, res) {
  var log = req.log;

  log = _.extend(log, req.body);

  log.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(log);
    }
  });
};

/**
 * Delete an Log
 */
exports.delete = function(req, res) {
  var log = req.log;

  log.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(log);
    }
  });
};

/**
 * List of Logs
 */
exports.list = function(req, res) {
  Log.find().sort('-created').populate('user', 'displayName').exec(function(err, logs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(logs);
    }
  });
};

/**
 * Log middleware
 */
exports.logByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Log is invalid'
    });
  }

  Log.findById(id).populate('user', 'displayName').exec(function (err, log) {
    if (err) {
      return next(err);
    } else if (!log) {
      return res.status(404).send({
        message: 'No Log with that identifier has been found'
      });
    }
    req.log = log;
    next();
  });
};
