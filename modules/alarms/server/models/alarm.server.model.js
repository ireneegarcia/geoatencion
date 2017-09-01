'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Alarm Schema
 */
var AlarmSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  categoryService: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    default: ''
    // trim: true
  },
  latitude: {
    type: String,
    default: ''
    // trim: true
  },
  longitude: {
    type: String,
    default: ''
    // trim: true
  },
  address: {
    type: String,
    default: ''
    // trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  serviceUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Alarm', AlarmSchema);
