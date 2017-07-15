'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Formulario = mongoose.model('Formulario'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Formulario
 */
exports.create = function(req, res) {
  var formulario = new Formulario(req.body);
  formulario.user = req.user;

  formulario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(formulario);
    }
  });
};

/**
 * Show the current Formulario
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var formulario = req.formulario ? req.formulario.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  formulario.isCurrentUserOwner = req.user && formulario.user && formulario.user._id.toString() === req.user._id.toString();

  res.jsonp(formulario);
};

/**
 * Update a Formulario
 */
exports.update = function(req, res) {
  var formulario = req.formulario;

  formulario = _.extend(formulario, req.body);

  formulario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(formulario);
    }
  });
};

/**
 * Delete an Formulario
 */
exports.delete = function(req, res) {
  var formulario = req.formulario;

  formulario.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(formulario);
    }
  });
};

/**
 * List of Formularios
 */
exports.list = function(req, res) {
  Formulario.find().sort('-created').populate('user', 'displayName').exec(function(err, formularios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(formularios);
    }
  });
};

/**
 * Formulario middleware
 */
exports.formularioByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Formulario is invalid'
    });
  }

  Formulario.findById(id).populate('user', 'displayName').exec(function (err, formulario) {
    if (err) {
      return next(err);
    } else if (!formulario) {
      return res.status(404).send({
        message: 'No Formulario with that identifier has been found'
      });
    }
    req.formulario = formulario;
    next();
  });
};
