'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Branch = mongoose.model('Branch'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Branch
 */
exports.create = function(req, res) {
  var branch = new Branch(req.body);
  branch.user = req.user;

  branch.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(branch);
    }
  });
};

/**
 * Show the current Branch
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var branch = req.branch ? req.branch.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  branch.isCurrentUserOwner = req.user && branch.user && branch.user._id.toString() === req.user._id.toString();

  res.jsonp(branch);
};

/**
 * Update a Branch
 */
exports.update = function(req, res) {
  var branch = req.branch;

  branch = _.extend(branch, req.body);

  branch.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(branch);
    }
  });
};

/**
 * Delete an Branch
 */
exports.delete = function(req, res) {
  var branch = req.branch;

  branch.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(branch);
    }
  });
};

/**
 * List of Branches
 */
exports.list = function(req, res) {
  Branch.find().sort('-created').populate('user', 'displayName').exec(function(err, branches) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(branches);
    }
  });
};

/**
 * Branch middleware
 */
exports.branchByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Branch is invalid'
    });
  }

  Branch.findById(id).populate('user', 'displayName').exec(function (err, branch) {
    if (err) {
      return next(err);
    } else if (!branch) {
      return res.status(404).send({
        message: 'No Branch with that identifier has been found'
      });
    }
    req.branch = branch;
    next();
  });
};
