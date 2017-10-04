'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Firebasetoken Schema
 */
var FirebasetokenSchema = new Schema({
  token: {
    type: String,
    trim: true
  },
  userId: {
    type: String,
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

mongoose.model('Firebasetoken', FirebasetokenSchema);
