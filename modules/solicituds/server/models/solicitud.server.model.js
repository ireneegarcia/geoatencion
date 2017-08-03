'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Solicitud Schema
 */
var SolicitudSchema = new Schema({
  category: {
    type: String,
    default: '',
    required: 'Por favor indique la categoría'
  },
  question1: {
    type: String,
    default: '',
    required: 'Please fill Formulario name',
    // trim: true
  },
  question2: {
    type: String,
    default: '',
     // required: 'Please fill Formulario name',
     // trim: true
  },
  question3: {
    type: String,
    default: '',
     // required: 'Please fill Formulario name',
     // trim: true
  },
  question4: {
    type: String,
    default: '',
     // required: 'Please fill Formulario name',
     // trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  organism: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Solicitud', SolicitudSchema);
