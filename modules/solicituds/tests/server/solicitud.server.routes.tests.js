'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Solicitud = mongoose.model('Solicitud'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  solicitud;

/**
 * Solicitud routes tests
 */
describe('Solicitud CRUD tests', function () {

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

    // Save a user to the test db and create new Solicitud
    user.save(function () {
      solicitud = {
        name: 'Solicitud name'
      };

      done();
    });
  });

  it('should be able to save a Solicitud if logged in', function (done) {
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

        // Save a new Solicitud
        agent.post('/api/solicituds')
          .send(solicitud)
          .expect(200)
          .end(function (solicitudSaveErr, solicitudSaveRes) {
            // Handle Solicitud save error
            if (solicitudSaveErr) {
              return done(solicitudSaveErr);
            }

            // Get a list of Solicituds
            agent.get('/api/solicituds')
              .end(function (solicitudsGetErr, solicitudsGetRes) {
                // Handle Solicituds save error
                if (solicitudsGetErr) {
                  return done(solicitudsGetErr);
                }

                // Get Solicituds list
                var solicituds = solicitudsGetRes.body;

                // Set assertions
                (solicituds[0].user._id).should.equal(userId);
                (solicituds[0].name).should.match('Solicitud name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Solicitud if not logged in', function (done) {
    agent.post('/api/solicituds')
      .send(solicitud)
      .expect(403)
      .end(function (solicitudSaveErr, solicitudSaveRes) {
        // Call the assertion callback
        done(solicitudSaveErr);
      });
  });

  it('should not be able to save an Solicitud if no name is provided', function (done) {
    // Invalidate name field
    solicitud.name = '';

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

        // Save a new Solicitud
        agent.post('/api/solicituds')
          .send(solicitud)
          .expect(400)
          .end(function (solicitudSaveErr, solicitudSaveRes) {
            // Set message assertion
            (solicitudSaveRes.body.message).should.match('Please fill Solicitud name');

            // Handle Solicitud save error
            done(solicitudSaveErr);
          });
      });
  });

  it('should be able to update an Solicitud if signed in', function (done) {
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

        // Save a new Solicitud
        agent.post('/api/solicituds')
          .send(solicitud)
          .expect(200)
          .end(function (solicitudSaveErr, solicitudSaveRes) {
            // Handle Solicitud save error
            if (solicitudSaveErr) {
              return done(solicitudSaveErr);
            }

            // Update Solicitud name
            solicitud.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Solicitud
            agent.put('/api/solicituds/' + solicitudSaveRes.body._id)
              .send(solicitud)
              .expect(200)
              .end(function (solicitudUpdateErr, solicitudUpdateRes) {
                // Handle Solicitud update error
                if (solicitudUpdateErr) {
                  return done(solicitudUpdateErr);
                }

                // Set assertions
                (solicitudUpdateRes.body._id).should.equal(solicitudSaveRes.body._id);
                (solicitudUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Solicituds if not signed in', function (done) {
    // Create new Solicitud model instance
    var solicitudObj = new Solicitud(solicitud);

    // Save the solicitud
    solicitudObj.save(function () {
      // Request Solicituds
      request(app).get('/api/solicituds')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Solicitud if not signed in', function (done) {
    // Create new Solicitud model instance
    var solicitudObj = new Solicitud(solicitud);

    // Save the Solicitud
    solicitudObj.save(function () {
      request(app).get('/api/solicituds/' + solicitudObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', solicitud.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Solicitud with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/solicituds/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Solicitud is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Solicitud which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Solicitud
    request(app).get('/api/solicituds/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Solicitud with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Solicitud if signed in', function (done) {
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

        // Save a new Solicitud
        agent.post('/api/solicituds')
          .send(solicitud)
          .expect(200)
          .end(function (solicitudSaveErr, solicitudSaveRes) {
            // Handle Solicitud save error
            if (solicitudSaveErr) {
              return done(solicitudSaveErr);
            }

            // Delete an existing Solicitud
            agent.delete('/api/solicituds/' + solicitudSaveRes.body._id)
              .send(solicitud)
              .expect(200)
              .end(function (solicitudDeleteErr, solicitudDeleteRes) {
                // Handle solicitud error error
                if (solicitudDeleteErr) {
                  return done(solicitudDeleteErr);
                }

                // Set assertions
                (solicitudDeleteRes.body._id).should.equal(solicitudSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Solicitud if not signed in', function (done) {
    // Set Solicitud user
    solicitud.user = user;

    // Create new Solicitud model instance
    var solicitudObj = new Solicitud(solicitud);

    // Save the Solicitud
    solicitudObj.save(function () {
      // Try deleting Solicitud
      request(app).delete('/api/solicituds/' + solicitudObj._id)
        .expect(403)
        .end(function (solicitudDeleteErr, solicitudDeleteRes) {
          // Set message assertion
          (solicitudDeleteRes.body.message).should.match('User is not authorized');

          // Handle Solicitud error error
          done(solicitudDeleteErr);
        });

    });
  });

  it('should be able to get a single Solicitud that has an orphaned user reference', function (done) {
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

          // Save a new Solicitud
          agent.post('/api/solicituds')
            .send(solicitud)
            .expect(200)
            .end(function (solicitudSaveErr, solicitudSaveRes) {
              // Handle Solicitud save error
              if (solicitudSaveErr) {
                return done(solicitudSaveErr);
              }

              // Set assertions on new Solicitud
              (solicitudSaveRes.body.name).should.equal(solicitud.name);
              should.exist(solicitudSaveRes.body.user);
              should.equal(solicitudSaveRes.body.user._id, orphanId);

              // force the Solicitud to have an orphaned user reference
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

                    // Get the Solicitud
                    agent.get('/api/solicituds/' + solicitudSaveRes.body._id)
                      .expect(200)
                      .end(function (solicitudInfoErr, solicitudInfoRes) {
                        // Handle Solicitud error
                        if (solicitudInfoErr) {
                          return done(solicitudInfoErr);
                        }

                        // Set assertions
                        (solicitudInfoRes.body._id).should.equal(solicitudSaveRes.body._id);
                        (solicitudInfoRes.body.name).should.equal(solicitud.name);
                        should.equal(solicitudInfoRes.body.user, undefined);

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
      Solicitud.remove().exec(done);
    });
  });
});
