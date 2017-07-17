'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Panel = mongoose.model('Panel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Panel
 */
exports.create = function(req, res) {
  var panel = new Panel(req.body);
  panel.user = req.user;

  panel.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panel);
    }
  });
};

/**
 * Show the current Panel
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var panel = req.panel ? req.panel.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  panel.isCurrentUserOwner = req.user && panel.user && panel.user._id.toString() === req.user._id.toString();

  res.jsonp(panel);
};

/**
 * Update a Panel
 */
exports.update = function(req, res) {
  var panel = req.panel;

  panel = _.extend(panel, req.body);

  panel.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panel);
    }
  });
};

/**
 * Delete an Panel
 */
exports.delete = function(req, res) {
  var panel = req.panel;

  panel.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panel);
    }
  });
};

/**
 * List of Panels
 */
exports.list = function(req, res) {
  Panel.find().sort('-created').populate('user', 'displayName').exec(function(err, panels) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(panels);
    }
  });
};

/**
 * Panel middleware
 */
exports.panelByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Panel is invalid'
    });
  }

  Panel.findById(id).populate('user', 'displayName').exec(function (err, panel) {
    if (err) {
      return next(err);
    } else if (!panel) {
      return res.status(404).send({
        message: 'No Panel with that identifier has been found'
      });
    }
    req.panel = panel;
    next();
  });
};
