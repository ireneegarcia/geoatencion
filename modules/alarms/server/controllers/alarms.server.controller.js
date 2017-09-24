'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Alarm = mongoose.model('Alarm'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Alarm
 */
exports.create = function(req, res) {
  var alarm = new Alarm(req.body);
  // alarm.user = req.user;
  alarm.location = {
    type: "Point",
    coordinates: [parseFloat(alarm.longitude), parseFloat(alarm.latitude)]
  };
  alarm.icon = '/modules/panels/client/img/wait.png';
  alarm.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarm);
    }
  });
};

/**
 * Show the current Alarm
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var alarm = req.alarm ? req.alarm.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  alarm.isCurrentUserOwner = req.user && alarm.user && alarm.user._id.toString() === req.user._id.toString();

  res.jsonp(alarm);
};

/**
 * Update a Alarm
 */
exports.update = function(req, res) {
  var alarm = req.alarm;
  alarm.location = {
    type: "Point",
    coordinates: [parseFloat(alarm.longitude), parseFloat(alarm.latitude)]
  };
  alarm = _.extend(alarm, req.body);

  alarm.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarm);
    }
  });
};

/**
 * Delete an Alarm
 */
exports.delete = function(req, res) {
  var alarm = req.alarm;

  alarm.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarm);
    }
  });
};

/**
 * List of Alarms
 */
exports.list = function(req, res) {
  Alarm.find().sort('-created').populate('user', 'displayName').exec(function(err, alarms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alarms);
    }
  });
};

/**
 * Alarm middleware
 */
exports.alarmByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Alarm is invalid'
    });
  }

  Alarm.findById(id).populate('user', 'displayName').exec(function (err, alarm) {
    if (err) {
      return next(err);
    } else if (!alarm) {
      return res.status(404).send({
        message: 'No Alarm with that identifier has been found'
      });
    }
    req.alarm = alarm;
    next();
  });
};
