'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Firebasetoken = mongoose.model('Firebasetoken'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Firebasetoken
 */
exports.create = function(req, res) {
  var firebasetoken = new Firebasetoken(req.body);
  firebasetoken.user = req.user;

  firebasetoken.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firebasetoken);
    }
  });
};

/**
 * Show the current Firebasetoken
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var firebasetoken = req.firebasetoken ? req.firebasetoken.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  firebasetoken.isCurrentUserOwner = req.user && firebasetoken.user && firebasetoken.user._id.toString() === req.user._id.toString();

  res.jsonp(firebasetoken);
};

/**
 * Update a Firebasetoken
 */
exports.update = function(req, res) {
  var firebasetoken = req.firebasetoken;

  firebasetoken = _.extend(firebasetoken, req.body);

  firebasetoken.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firebasetoken);
    }
  });
};

/**
 * Delete an Firebasetoken
 */
exports.delete = function(req, res) {
  var firebasetoken = req.firebasetoken;

  firebasetoken.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firebasetoken);
    }
  });
};

/**
 * List of Firebasetokens
 */
exports.list = function(req, res) {
  Firebasetoken.find().sort('-created').populate('user', 'displayName').exec(function(err, firebasetokens) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firebasetokens);
    }
  });
};

/**
 * Firebasetoken middleware
 */
exports.firebasetokenByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Firebasetoken is invalid'
    });
  }

  Firebasetoken.findById(id).populate('user', 'displayName').exec(function (err, firebasetoken) {
    if (err) {
      return next(err);
    } else if (!firebasetoken) {
      return res.status(404).send({
        message: 'No Firebasetoken with that identifier has been found'
      });
    }
    req.firebasetoken = firebasetoken;
    next();
  });
};
