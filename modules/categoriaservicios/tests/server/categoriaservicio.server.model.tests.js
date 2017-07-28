'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categoriaservicio = mongoose.model('Categoriaservicio');

/**
 * Globals
 */
var user,
  categoriaservicio;

/**
 * Unit tests
 */
describe('Categoriaservicio Model Unit Tests:', function() {
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
      categoriaservicio = new Categoriaservicio({
        name: 'Categoriaservicio Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return categoriaservicio.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      categoriaservicio.name = '';

      return categoriaservicio.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Categoriaservicio.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
