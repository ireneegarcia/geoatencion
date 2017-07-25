'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Alarma Schema
 */
var AlarmaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Alarma name',
    trim: true
  },
  icon: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
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

mongoose.model('Alarma', AlarmaSchema);
