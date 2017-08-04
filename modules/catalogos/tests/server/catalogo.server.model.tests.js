'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Catalogo = mongoose.model('Catalogo');

/**
 * Globals
 */
var user,
  catalogo;

/**
 * Unit tests
 */
describe('Catalogo Model Unit Tests:', function() {
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
      catalogo = new Catalogo({
        name: 'Catalogo Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return catalogo.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      catalogo.name = '';

      return catalogo.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Catalogo.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
