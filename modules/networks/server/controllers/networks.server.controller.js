'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Network = mongoose.model('mobileUnit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a Network
 */
exports.create = function(req, res) {
  var network = new Network(req.body);
  network.user = req.user;
  // Los siguientes valores se rellenarán a través de la movil
  network.longitude = '';
  network.latitude = '';
  network.location = {
    type: 'Point',
    coordinates: [parseFloat(0), parseFloat(0)]
  };
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
 * Set Networks position
 */
exports.newPosition = function(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.networkId)) {
    return res.status(400).send({
      message: 'Network is invalid'
    });
  }
  var data = {
    latitude: req.body.lat,
    longitude: req.body.lng,
    address: req.body.address,
    location: {
      type: 'Point',
      coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
    }
  };
  Network.update({_id: req.params.networkId}, data, function(err, raw) {
    if (err) {
      res.status(400).send(err);
    }
    req.app.get('socketio').emit('networkPositionEvent', {
      id: req.params.networkId,
      latitude: req.body.lat,
      longitude: req.body.lng
    });
    return res.status(200).send({message: 'Successfully saved new position'});
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
