'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Estadistica = mongoose.model('Estadistica'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  estadistica;

/**
 * Estadistica routes tests
 */
describe('Estadistica CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Estadistica
    user.save(function () {
      estadistica = {
        name: 'Estadistica name'
      };

      done();
    });
  });

  it('should be able to save a Estadistica if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Estadistica
        agent.post('/api/estadisticas')
          .send(estadistica)
          .expect(200)
          .end(function (estadisticaSaveErr, estadisticaSaveRes) {
            // Handle Estadistica save error
            if (estadisticaSaveErr) {
              return done(estadisticaSaveErr);
            }

            // Get a list of Estadisticas
            agent.get('/api/estadisticas')
              .end(function (estadisticasGetErr, estadisticasGetRes) {
                // Handle Estadisticas save error
                if (estadisticasGetErr) {
                  return done(estadisticasGetErr);
                }

                // Get Estadisticas list
                var estadisticas = estadisticasGetRes.body;

                // Set assertions
                (estadisticas[0].user._id).should.equal(userId);
                (estadisticas[0].name).should.match('Estadistica name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Estadistica if not logged in', function (done) {
    agent.post('/api/estadisticas')
      .send(estadistica)
      .expect(403)
      .end(function (estadisticaSaveErr, estadisticaSaveRes) {
        // Call the assertion callback
        done(estadisticaSaveErr);
      });
  });

  it('should not be able to save an Estadistica if no name is provided', function (done) {
    // Invalidate name field
    estadistica.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Estadistica
        agent.post('/api/estadisticas')
          .send(estadistica)
          .expect(400)
          .end(function (estadisticaSaveErr, estadisticaSaveRes) {
            // Set message assertion
            (estadisticaSaveRes.body.message).should.match('Please fill Estadistica name');

            // Handle Estadistica save error
            done(estadisticaSaveErr);
          });
      });
  });

  it('should be able to update an Estadistica if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Estadistica
        agent.post('/api/estadisticas')
          .send(estadistica)
          .expect(200)
          .end(function (estadisticaSaveErr, estadisticaSaveRes) {
            // Handle Estadistica save error
            if (estadisticaSaveErr) {
              return done(estadisticaSaveErr);
            }

            // Update Estadistica name
            estadistica.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Estadistica
            agent.put('/api/estadisticas/' + estadisticaSaveRes.body._id)
              .send(estadistica)
              .expect(200)
              .end(function (estadisticaUpdateErr, estadisticaUpdateRes) {
                // Handle Estadistica update error
                if (estadisticaUpdateErr) {
                  return done(estadisticaUpdateErr);
                }

                // Set assertions
                (estadisticaUpdateRes.body._id).should.equal(estadisticaSaveRes.body._id);
                (estadisticaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Estadisticas if not signed in', function (done) {
    // Create new Estadistica model instance
    var estadisticaObj = new Estadistica(estadistica);

    // Save the estadistica
    estadisticaObj.save(function () {
      // Request Estadisticas
      request(app).get('/api/estadisticas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Estadistica if not signed in', function (done) {
    // Create new Estadistica model instance
    var estadisticaObj = new Estadistica(estadistica);

    // Save the Estadistica
    estadisticaObj.save(function () {
      request(app).get('/api/estadisticas/' + estadisticaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', estadistica.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Estadistica with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/estadisticas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Estadistica is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Estadistica which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Estadistica
    request(app).get('/api/estadisticas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Estadistica with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Estadistica if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Estadistica
        agent.post('/api/estadisticas')
          .send(estadistica)
          .expect(200)
          .end(function (estadisticaSaveErr, estadisticaSaveRes) {
            // Handle Estadistica save error
            if (estadisticaSaveErr) {
              return done(estadisticaSaveErr);
            }

            // Delete an existing Estadistica
            agent.delete('/api/estadisticas/' + estadisticaSaveRes.body._id)
              .send(estadistica)
              .expect(200)
              .end(function (estadisticaDeleteErr, estadisticaDeleteRes) {
                // Handle estadistica error error
                if (estadisticaDeleteErr) {
                  return done(estadisticaDeleteErr);
                }

                // Set assertions
                (estadisticaDeleteRes.body._id).should.equal(estadisticaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Estadistica if not signed in', function (done) {
    // Set Estadistica user
    estadistica.user = user;

    // Create new Estadistica model instance
    var estadisticaObj = new Estadistica(estadistica);

    // Save the Estadistica
    estadisticaObj.save(function () {
      // Try deleting Estadistica
      request(app).delete('/api/estadisticas/' + estadisticaObj._id)
        .expect(403)
        .end(function (estadisticaDeleteErr, estadisticaDeleteRes) {
          // Set message assertion
          (estadisticaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Estadistica error error
          done(estadisticaDeleteErr);
        });

    });
  });

  it('should be able to get a single Estadistica that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Estadistica
          agent.post('/api/estadisticas')
            .send(estadistica)
            .expect(200)
            .end(function (estadisticaSaveErr, estadisticaSaveRes) {
              // Handle Estadistica save error
              if (estadisticaSaveErr) {
                return done(estadisticaSaveErr);
              }

              // Set assertions on new Estadistica
              (estadisticaSaveRes.body.name).should.equal(estadistica.name);
              should.exist(estadisticaSaveRes.body.user);
              should.equal(estadisticaSaveRes.body.user._id, orphanId);

              // force the Estadistica to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Estadistica
                    agent.get('/api/estadisticas/' + estadisticaSaveRes.body._id)
                      .expect(200)
                      .end(function (estadisticaInfoErr, estadisticaInfoRes) {
                        // Handle Estadistica error
                        if (estadisticaInfoErr) {
                          return done(estadisticaInfoErr);
                        }

                        // Set assertions
                        (estadisticaInfoRes.body._id).should.equal(estadisticaSaveRes.body._id);
                        (estadisticaInfoRes.body.name).should.equal(estadistica.name);
                        should.equal(estadisticaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Estadistica.remove().exec(done);
    });
  });
});
