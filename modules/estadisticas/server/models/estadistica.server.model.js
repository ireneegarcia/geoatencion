'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Estadistica Schema
 */
var EstadisticaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Estadistica name',
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

mongoose.model('Estadistica', EstadisticaSchema);
