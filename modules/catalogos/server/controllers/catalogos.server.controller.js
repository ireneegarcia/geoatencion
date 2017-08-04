'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Catalogo = mongoose.model('Catalogo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Catalogo
 */
exports.create = function(req, res) {
  var catalogo = new Catalogo(req.body);
  catalogo.user = req.user;

  catalogo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(catalogo);
    }
  });
};

/**
 * Show the current Catalogo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var catalogo = req.catalogo ? req.catalogo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  catalogo.isCurrentUserOwner = req.user && catalogo.user && catalogo.user._id.toString() === req.user._id.toString();

  res.jsonp(catalogo);
};

/**
 * Update a Catalogo
 */
exports.update = function(req, res) {
  var catalogo = req.catalogo;

  catalogo = _.extend(catalogo, req.body);

  catalogo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(catalogo);
    }
  });
};

/**
 * Delete an Catalogo
 */
exports.delete = function(req, res) {
  var catalogo = req.catalogo;

  catalogo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(catalogo);
    }
  });
};

/**
 * List of Catalogos
 */
exports.list = function(req, res) {
  Catalogo.find().sort('-created').populate('user', 'displayName').exec(function(err, catalogos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(catalogos);
    }
  });
};

/**
 * Catalogo middleware
 */
exports.catalogoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Catalogo is invalid'
    });
  }

  Catalogo.findById(id).populate('user', 'displayName').exec(function (err, catalogo) {
    if (err) {
      return next(err);
    } else if (!catalogo) {
      return res.status(404).send({
        message: 'No Catalogo with that identifier has been found'
      });
    }
    req.catalogo = catalogo;
    next();
  });
};
