'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Panel Schema
 */
var PanelSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Panel name',
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

mongoose.model('Panel', PanelSchema);
