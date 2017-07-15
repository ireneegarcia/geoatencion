'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Formulario Schema
 */
var FormularioSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Formulario name',
    trim: true
  },
  question: {
    type: String,
    default: '',
    required: 'Please fill Formulario name'
    //trim: true
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

mongoose.model('Formulario', FormularioSchema);
