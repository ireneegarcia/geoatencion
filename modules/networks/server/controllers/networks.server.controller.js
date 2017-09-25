'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Network = mongoose.model('Network'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a Network
 */
exports.create = function(req, res) {
  var network = new Network(req.body);
  network.user = req.user;
  network.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(network);
    }
  });
};

/**
 * Show the current Network
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var network = req.network ? req.network.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  network.isCurrentUserOwner = req.user && network.user && network.user._id.toString() === req.user._id.toString();

  res.jsonp(network);
};

/**
 * Update a Network
 */
exports.update = function(req, res) {
  var network = req.network;
  network = _.extend(network, req.body);

  network.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(network);
    }
  });
};

/**
 * Delete an Network
 */
exports.delete = function(req, res) {
  var network = req.network;

  network.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(network);
    }
  });
};

/**
 * List of Networks
 */
exports.list = function(req, res) {
  Network.find().sort('-created').populate('user', 'displayName').exec(function(err, networks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(networks);
    }
  });
};

/**
 * Get Networks nearby coordinates
 */
exports.near = function(req, res) {
  var geoJson = {
    type: 'Point',
    coordinates: [parseFloat(req.params.lng), parseFloat(req.params.lat)]
  };
  var options = {
    spherical: true,
    maxDistance: 3000,
    query: {status: 'activo'}
  };
  Network.geoNear(geoJson, options, function (err, networks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(networks);
    }
  });
};

/**
 * Network middleware
 */
exports.networkByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Network is invalid'
    });
  }

  Network.findById(id).populate('user', 'displayName').exec(function (err, network) {
    if (err) {
      return next(err);
    } else if (!network) {
      return res.status(404).send({
        message: 'No Network with that identifier has been found'
      });
    }
    req.network = network;
    next();
  });
};
