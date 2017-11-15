'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  validator = require('validator'),
  Schema = mongoose.Schema;

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * Organism Schema
 */
var OrganismSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Organism name',
    trim: true
  },
  rif: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    default: '',
    required: 'Please fill Organism name',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    required: 'Please fill Organism name',
    trim: true
  },
  category: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Por favor indique su correo']
  },
  country: {
    type: String,
    default: '',
    required: 'Please fill Organism name',
    trim: true
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill Organism name',
    trim: true
  },
  plan: {
    type: String,
    default: '',
    trim: true
  },
  isActive: {
    type: String,
    default: 'inactivo',
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

mongoose.model('Organism', OrganismSchema);
