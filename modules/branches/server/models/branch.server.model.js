'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Branch Schema
 */

var BranchSchema = new Schema({
  location: {
    'type': {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
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

BranchSchema.index({location: '2dsphere'});
mongoose.model('Branch', BranchSchema);
