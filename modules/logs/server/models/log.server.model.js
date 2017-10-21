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
    type: String,
    default: ''
  },
  network: {
    type: String,
    default: ''
  },
  client: {
    type: String,
    default: ''
  },
  user: {
    type: String,
    default: ''
  },
  organism: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Log', LogSchema);
