'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Network Schema
 */
var NetworkSchema = new Schema({
  carBrand: {
    type: String,
    default: '',
    required: 'Por favor introduzca la marca del vehículo',
    trim: true
  },
  carModel: {
    type: String,
    default: '',
    required: 'Por favor introduzca el modelo del vehículo',
    // trim: true
  },
  carPlate: {
    type: String,
    default: '',
    required: 'Por favor introduzca la placa del vehículo',
    trim: true
  },
  carColor: {
    type: String,
    default: '',
    required: 'Por favor introduzca el color del vehículo',
     // trim: true
  },
  category: {
    type: String,
    default: '',
    required: 'Por favor indique la categoría por defecto para el servicio de la unidad',
     // trim: true
  },
  status: {
    type: String,
    default: '',
    required: 'Por favor indique el status de la unidad',
     // trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  userService: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Network', NetworkSchema);
