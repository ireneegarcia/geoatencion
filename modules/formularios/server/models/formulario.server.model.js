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
  category: {
    type: String,
    default: '',
    required: 'Por favor indique la categoría por defecto para el servicio de la unidad'/*,
     trim: true*/
  },
  question1: {
    type: String,
    default: '',
    required: 'Please fill Formulario name'
    //trim: true
  },
  question2: {
    type: String,
    default: ''/*,
    required: 'Please fill Formulario name'
    trim: true*/
  },
  question3: {
    type: String,
    default: ''/*,
    required: 'Please fill Formulario name'
    trim: true*/
  },
  question4: {
    type: String,
    default: ''/*,
    required: 'Please fill Formulario name'
    trim: true*/
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
