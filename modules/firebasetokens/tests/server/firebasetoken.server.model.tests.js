'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Firebasetoken = mongoose.model('Firebasetoken');

/**
 * Globals
 */
var user,
  firebasetoken;

/**
 * Unit tests
 */
describe('Firebasetoken Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      firebasetoken = new Firebasetoken({
        name: 'Firebasetoken Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return firebasetoken.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      firebasetoken.name = '';

      return firebasetoken.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Firebasetoken.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
