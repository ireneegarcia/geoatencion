'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mobileunithistory Schema
 */
var MobileunithistorySchema = new Schema({
  mobileUnit: {
    type: Schema.ObjectId,
    ref: 'Network'
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
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Mobileunithistory', MobileunithistorySchema);
