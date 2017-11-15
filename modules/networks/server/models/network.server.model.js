'use strict';

/**
 * Module dependencies.
 */
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Validación length del carCode
 */
var validateCarCode = function (carCode) {
  return (carCode.length <= 6);
};

/**
 * Network Schema
 */
var NetworkSchema = new Schema({
  carCode: {
    type: String,
    maxlength: [6, 'El código debe ser de máximo 6 dígitos'],
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    trim: true,
    required: 'Por favor indique un código de máximo 6 dígitos'
  },
  carBrand: {
    type: String,
    default: '',
    required: 'Por favor introduzca la marca del vehículo',
    trim: true
  },
  carModel: {
    type: String,
    default: '',
    required: 'Por favor introduzca el modelo del vehículo'
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
    required: 'Por favor introduzca el color del vehículo'
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
    required: 'Por favor indique el status de la unidad'
     // trim: true
  },
  latitude: {
    type: String,
    default: ''
    // trim: true
  },
  longitude: {
    type: String,
    default: ''
    // trim: true
  },
  location: {
    index: '2dsphere',
    type: mongoose.Schema.Types.GeoJSON
  },
  address: {
    type: String,
    default: ''
    // trim: true
  },
  icon: {
    type: String,
    default: '/modules/panels/client/img/car-placeholder.png'
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
  serviceUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('mobileUnit', NetworkSchema);
