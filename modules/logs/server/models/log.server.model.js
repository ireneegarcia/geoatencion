'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Log Schema
 */
var LogSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  alarm: {
    type: Schema.ObjectId,
    ref: 'Alarm'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Log', LogSchema);
