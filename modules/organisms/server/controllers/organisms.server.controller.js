'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Organism = mongoose.model('Organism'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Organism
 */
exports.create = function(req, res) {
  var organism = new Organism(req.body);
  organism.user = req.user;

  organism.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organism);
    }
  });
};

/**
 * Show the current Organism
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var organism = req.organism ? req.organism.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  organism.isCurrentUserOwner = req.user && organism.user && organism.user._id.toString() === req.user._id.toString();

  res.jsonp(organism);
};

/**
 * Update a Organism
 */
exports.update = function(req, res) {
  var organism = req.organism;

  organism = _.extend(organism, req.body);

  organism.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organism);
    }
  });
};

/**
 * Delete an Organism
 */
exports.delete = function(req, res) {
  var organism = req.organism;

  organism.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organism);
    }
  });
};

/**
 * List of Organisms
 */
exports.list = function(req, res) {
  Organism.find().sort('-created').populate('user', 'displayName').exec(function(err, organisms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organisms);
    }
  });
};

/**
 * Organism middleware
 */
exports.organismByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Organism is invalid'
    });
  }

  Organism.findById(id).populate('user', 'displayName').exec(function (err, organism) {
    if (err) {
      return next(err);
    } else if (!organism) {
      return res.status(404).send({
        message: 'No Organism with that identifier has been found'
      });
    }
    req.organism = organism;
    next();
  });
};
