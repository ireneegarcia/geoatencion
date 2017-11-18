'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adminlog = mongoose.model('Adminlog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adminlog
 */
exports.create = function(req, res) {
  var adminlog = new Adminlog(req.body);
  adminlog.user = req.user;

  adminlog.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminlog);
    }
  });
};

/**
 * Show the current Adminlog
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adminlog = req.adminlog ? req.adminlog.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adminlog.isCurrentUserOwner = req.user && adminlog.user && adminlog.user._id.toString() === req.user._id.toString();

  res.jsonp(adminlog);
};

/**
 * Update a Adminlog
 */
exports.update = function(req, res) {
  var adminlog = req.adminlog;

  adminlog = _.extend(adminlog, req.body);

  adminlog.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminlog);
    }
  });
};

/**
 * Delete an Adminlog
 */
exports.delete = function(req, res) {
  var adminlog = req.adminlog;

  adminlog.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminlog);
    }
  });
};

/**
 * List of Adminlogs
 */
exports.list = function(req, res) {
  Adminlog.find().sort('-created').populate('user', 'displayName').exec(function(err, adminlogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminlogs);
    }
  });
};

/**
 * Adminlog middleware
 */
exports.adminlogByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adminlog is invalid'
    });
  }

  Adminlog.findById(id).populate('user', 'displayName').exec(function (err, adminlog) {
    if (err) {
      return next(err);
    } else if (!adminlog) {
      return res.status(404).send({
        message: 'No Adminlog with that identifier has been found'
      });
    }
    req.adminlog = adminlog;
    next();
  });
};
