'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adminlog Schema
 */
var AdminlogSchema = new Schema({
  description: {
    type: String,
    default: '',
    required: '',
    trim: true
  },
  module: {
    type: String,
    default: '',
    required: '',
    trim: true
  },
  organism: {
    type: String,
    default: '',
    required: '',
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

mongoose.model('Adminlog', AdminlogSchema);
