'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mobileunitlog Schema
 */
var MobileunitlogSchema = new Schema({
  mobileUnit: {
    type: String,
    default: '',
    required: 'Please fill Mobileunitlog name',
    trim: true
  },
  mobileUnitCarCode: {
    type: String,
    default: '',
    required: 'Please fill Mobileunitlog name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Mobileunitlog name',
    trim: true
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

mongoose.model('Mobileunitlog', MobileunitlogSchema);
