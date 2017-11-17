'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mobileunitlog = mongoose.model('Mobileunitlog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mobileunitlog
 */
exports.create = function(req, res) {
  var mobileunitlog = new Mobileunitlog(req.body);
  mobileunitlog.user = req.user;

  mobileunitlog.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunitlog);
    }
  });
};

/**
 * Show the current Mobileunitlog
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mobileunitlog = req.mobileunitlog ? req.mobileunitlog.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mobileunitlog.isCurrentUserOwner = req.user && mobileunitlog.user && mobileunitlog.user._id.toString() === req.user._id.toString();

  res.jsonp(mobileunitlog);
};

/**
 * Update a Mobileunitlog
 */
exports.update = function(req, res) {
  var mobileunitlog = req.mobileunitlog;

  mobileunitlog = _.extend(mobileunitlog, req.body);

  mobileunitlog.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunitlog);
    }
  });
};

/**
 * Delete an Mobileunitlog
 */
exports.delete = function(req, res) {
  var mobileunitlog = req.mobileunitlog;

  mobileunitlog.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunitlog);
    }
  });
};

/**
 * List of Mobileunitlogs
 */
exports.list = function(req, res) {
  Mobileunitlog.find().sort('-created').populate('user', 'displayName').exec(function(err, mobileunitlogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunitlogs);
    }
  });
};

/**
 * Mobileunitlog middleware
 */
exports.mobileunitlogByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mobileunitlog is invalid'
    });
  }

  Mobileunitlog.findById(id).populate('user', 'displayName').exec(function (err, mobileunitlog) {
    if (err) {
      return next(err);
    } else if (!mobileunitlog) {
      return res.status(404).send({
        message: 'No Mobileunitlog with that identifier has been found'
      });
    }
    req.mobileunitlog = mobileunitlog;
    next();
  });
};
