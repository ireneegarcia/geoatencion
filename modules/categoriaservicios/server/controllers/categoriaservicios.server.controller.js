'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Categoriaservicio = mongoose.model('Categoriaservicio'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Categoriaservicio
 */
exports.create = function(req, res) {
  var categoriaservicio = new Categoriaservicio(req.body);
  categoriaservicio.user = req.user;

  categoriaservicio.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoriaservicio);
    }
  });
};

/**
 * Show the current Categoriaservicio
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var categoriaservicio = req.categoriaservicio ? req.categoriaservicio.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  categoriaservicio.isCurrentUserOwner = req.user && categoriaservicio.user && categoriaservicio.user._id.toString() === req.user._id.toString();

  res.jsonp(categoriaservicio);
};

/**
 * Update a Categoriaservicio
 */
exports.update = function(req, res) {
  var categoriaservicio = req.categoriaservicio;

  categoriaservicio = _.extend(categoriaservicio, req.body);

  categoriaservicio.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoriaservicio);
    }
  });
};

/**
 * Delete an Categoriaservicio
 */
exports.delete = function(req, res) {
  var categoriaservicio = req.categoriaservicio;

  categoriaservicio.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoriaservicio);
    }
  });
};

/**
 * List of Categoriaservicios
 */
exports.list = function(req, res) {
  Categoriaservicio.find().sort('-created').populate('user', 'displayName').exec(function(err, categoriaservicios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoriaservicios);
    }
  });
};

/**
 * Categoriaservicio middleware
 */
exports.categoriaservicioByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Categoriaservicio is invalid'
    });
  }

  Categoriaservicio.findById(id).populate('user', 'displayName').exec(function (err, categoriaservicio) {
    if (err) {
      return next(err);
    } else if (!categoriaservicio) {
      return res.status(404).send({
        message: 'No Categoriaservicio with that identifier has been found'
      });
    }
    req.categoriaservicio = categoriaservicio;
    next();
  });
};
