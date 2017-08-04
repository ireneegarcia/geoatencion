'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Catalogo Schema
 */
var CatalogoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Catalogo name',
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

mongoose.model('Catalogo', CatalogoSchema);
