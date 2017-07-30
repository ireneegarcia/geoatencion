'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Categoriaservicio Schema
 */
var CategoriaservicioSchema = new Schema({
  category: {
    type: String,
    default: '',
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    required: 'Por favor introduzca el nombre de la categoria de servicio',
    trim: true
  },
  iconUrl: {
    type: String,
    default: './modules/categoriaservicios/client/img/icon/default.png'
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

mongoose.model('Categoriaservicio', CategoriaservicioSchema);
