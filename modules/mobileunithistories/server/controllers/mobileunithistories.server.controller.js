'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mobileunithistory = mongoose.model('Mobileunithistory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mobileunithistory
 */
exports.create = function(req, res) {
  var mobileunithistory = new Mobileunithistory(req.body);
  mobileunithistory.user = req.user;

  mobileunithistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunithistory);
    }
  });
};

/**
 * Show the current Mobileunithistory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mobileunithistory = req.mobileunithistory ? req.mobileunithistory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mobileunithistory.isCurrentUserOwner = req.user && mobileunithistory.user && mobileunithistory.user._id.toString() === req.user._id.toString();

  res.jsonp(mobileunithistory);
};

/**
 * Update a Mobileunithistory
 */
exports.update = function(req, res) {
  var mobileunithistory = req.mobileunithistory;

  mobileunithistory = _.extend(mobileunithistory, req.body);

  mobileunithistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunithistory);
    }
  });
};

/**
 * Delete an Mobileunithistory
 */
exports.delete = function(req, res) {
  var mobileunithistory = req.mobileunithistory;

  mobileunithistory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunithistory);
    }
  });
};

/**
 * List of Mobileunithistories
 */
exports.list = function(req, res) {
  Mobileunithistory.find().sort('-created').populate('user', 'displayName').exec(function(err, mobileunithistories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobileunithistories);
    }
  });
};

/**
 * Mobileunithistory middleware
 */
exports.mobileunithistoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mobileunithistory is invalid'
    });
  }

  Mobileunithistory.findById(id).populate('user', 'displayName').exec(function (err, mobileunithistory) {
    if (err) {
      return next(err);
    } else if (!mobileunithistory) {
      return res.status(404).send({
        message: 'No Mobileunithistory with that identifier has been found'
      });
    }
    req.mobileunithistory = mobileunithistory;
    next();
  });
};
