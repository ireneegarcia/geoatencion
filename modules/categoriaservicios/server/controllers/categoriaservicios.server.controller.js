'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Categoriaservicio = mongoose.model('Categoriaservicio'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  multer = require('multer'),
  fs = require('fs'),
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

/**
 * Set icon Categoriaservicio
 */
exports.setIcon = function (req, res) {
  var categoriaservicioId = req.params.categoriaservicioId;
  var categoriaservicio = req.categoriaservicio;

  // Filtering to upload only images
  var multerConfig = config.uploads.category.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newIconPicture');

  uploadImage()
    .then(deleteOldImage)
    .then(updateCategory)
    .then(function() {
      res.json(categoriaservicio);
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateCategory () {
    return new Promise(function (resolve, reject) {
      categoriaservicio.iconUrl = config.uploads.category.image.dest + req.file.filename;
      categoriaservicio.save(function (err, response) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
    return new Promise(function (resolve, reject) {
      var existingIconUrl = categoriaservicio.iconUrl;
      if (existingIconUrl !== Categoriaservicio.schema.path('iconUrl').defaultValue) {
        fs.unlink(existingIconUrl, function (unlinkError) {
          if (unlinkError) {
            console.log(unlinkError);
            reject({
              message: 'Error occurred while deleting old profile picture'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
};
