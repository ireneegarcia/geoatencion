'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'El nombre no puede quedar en blanco'
  },
  about: {
    type: String,
    default: '',
    //trim: true,
    required: 'La descripción no puede quedar en blanco'
  },
  category: {
    type: String,
    default: '',
    required: 'Por favor indique la categoría por defecto para el servicio de la unidad'/*,
     trim: true*/
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Article', ArticleSchema);
