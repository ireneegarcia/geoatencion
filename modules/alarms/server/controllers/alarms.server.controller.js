'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Alarm = mongoose.model('Alarm'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var FCM = require('fcm-push');

var serverKey = 'AAAAWRz9nSc:APA91bHdl7rkylz-h1xoZL4qM4dNOunugF4aTiWk3tyguZnUP2GFll4aF-Iktg8AFYE3tso8YieZmcvL7OdIjjumsKGZvZzKyKtzpaQnMUbqFVyJp5e0YLAj9hHVFCuqhmGIN8BtVBtW';
var fcm = new FCM(serverKey);

/**
 * Create a Alarm
 */
exports.create = function(req, res) {
  var alarm = new Alarm(req.body);
  // alarm.user = req.user;
  alarm.location = {
    type: 'Point',
    coordinates: [parseFloat(alarm.longitude), parseFloat(alarm.latitude)]
  };
  alarm.icon = '/modules/panels/client/img/wait.png';
  alarm.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.app.get('socketio').emit('alarmEvent', alarm);
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
  var body = req.body;
  var message;
  var messageNetwork;

  alarm.location = {
    type: 'Point',
    coordinates: [parseFloat(alarm.longitude), parseFloat(alarm.latitude)]
  };

  alarm = _.extend(alarm, req.body);

console.log(alarm);
console.log('aja');
console.log(body);

  if (alarm.status === 'en atencion') {
    message = {
      to: alarm.firebasetoken, // required fill with device token or topics
      notification: {
        title: 'Notificacion de atención',
        body: alarm.status
      },
      data: {
        networkLatitude: body.networkLatitude,
        networkLongitude: body.networkLongitude,
        networkAddress: body.networkAddress,
        status: alarm.status,
        networkCode: body.networkCarCode

      }
    };

    messageNetwork = {
      to: body.firebasetokenNetwork, // required fill with device token or topics
      notification: {
        title: 'Notificacion de atención',
        body: alarm.status
      },
      data: {
        clientLatitude: alarm.latitude,
        clientLongitude: alarm.longitude,
        clientAddress: alarm.address,
        clientName: alarm.user.displayName,
        status: alarm.status
      }
    };

    // callback style
    fcm.send(messageNetwork, function(err, response) {
      if (err) {
        console.log("Something has gone wrong!"+ err.toString());
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  }

  if (alarm.status === 'cancelado') {

    message = {
      to: alarm.firebasetoken, // required fill with device token or topics
      notification: {
        title: 'Solicitud ' + alarm.status,
        body: alarm.status
      },
      data: {
        status: alarm.status
      }
    };

    messageNetwork = {
      to: alarm.firebasetokenNetwork, // required fill with device token or topics
      notification: {
        title: 'Solicitud ' + alarm.status,
        body: alarm.status
      },
      data: {
        status: alarm.status
      }
    };

    // callback style
    fcm.send(messageNetwork, function(err, response) {
      if (err) {
        console.log("Something has gone wrong!"+ err.toString());
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  }

  if (alarm.status === 'rechazado' || alarm.status === 'atendido') {
    message = {
      to: alarm.firebasetoken, // required fill with device token or topics
      notification: {
        title: 'Solicitud ' + alarm.status,
        body: alarm.status
      },
      data: {
        status: alarm.status
      }
    };
  }

  fcm.send(message, function(err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });

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
