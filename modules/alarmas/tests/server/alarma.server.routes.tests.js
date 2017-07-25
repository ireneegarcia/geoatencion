'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Alarma = mongoose.model('Alarma'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  alarma;

/**
 * Alarma routes tests
 */
describe('Alarma CRUD tests', function () {

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

    // Save a user to the test db and create new Alarma
    user.save(function () {
      alarma = {
        name: 'Alarma name'
      };

      done();
    });
  });

  it('should be able to save a Alarma if logged in', function (done) {
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

        // Save a new Alarma
        agent.post('/api/alarmas')
          .send(alarma)
          .expect(200)
          .end(function (alarmaSaveErr, alarmaSaveRes) {
            // Handle Alarma save error
            if (alarmaSaveErr) {
              return done(alarmaSaveErr);
            }

            // Get a list of Alarmas
            agent.get('/api/alarmas')
              .end(function (alarmasGetErr, alarmasGetRes) {
                // Handle Alarmas save error
                if (alarmasGetErr) {
                  return done(alarmasGetErr);
                }

                // Get Alarmas list
                var alarmas = alarmasGetRes.body;

                // Set assertions
                (alarmas[0].user._id).should.equal(userId);
                (alarmas[0].name).should.match('Alarma name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Alarma if not logged in', function (done) {
    agent.post('/api/alarmas')
      .send(alarma)
      .expect(403)
      .end(function (alarmaSaveErr, alarmaSaveRes) {
        // Call the assertion callback
        done(alarmaSaveErr);
      });
  });

  it('should not be able to save an Alarma if no name is provided', function (done) {
    // Invalidate name field
    alarma.name = '';

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

        // Save a new Alarma
        agent.post('/api/alarmas')
          .send(alarma)
          .expect(400)
          .end(function (alarmaSaveErr, alarmaSaveRes) {
            // Set message assertion
            (alarmaSaveRes.body.message).should.match('Please fill Alarma name');

            // Handle Alarma save error
            done(alarmaSaveErr);
          });
      });
  });

  it('should be able to update an Alarma if signed in', function (done) {
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

        // Save a new Alarma
        agent.post('/api/alarmas')
          .send(alarma)
          .expect(200)
          .end(function (alarmaSaveErr, alarmaSaveRes) {
            // Handle Alarma save error
            if (alarmaSaveErr) {
              return done(alarmaSaveErr);
            }

            // Update Alarma name
            alarma.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Alarma
            agent.put('/api/alarmas/' + alarmaSaveRes.body._id)
              .send(alarma)
              .expect(200)
              .end(function (alarmaUpdateErr, alarmaUpdateRes) {
                // Handle Alarma update error
                if (alarmaUpdateErr) {
                  return done(alarmaUpdateErr);
                }

                // Set assertions
                (alarmaUpdateRes.body._id).should.equal(alarmaSaveRes.body._id);
                (alarmaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Alarmas if not signed in', function (done) {
    // Create new Alarma model instance
    var alarmaObj = new Alarma(alarma);

    // Save the alarma
    alarmaObj.save(function () {
      // Request Alarmas
      request(app).get('/api/alarmas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Alarma if not signed in', function (done) {
    // Create new Alarma model instance
    var alarmaObj = new Alarma(alarma);

    // Save the Alarma
    alarmaObj.save(function () {
      request(app).get('/api/alarmas/' + alarmaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', alarma.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Alarma with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/alarmas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Alarma is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Alarma which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Alarma
    request(app).get('/api/alarmas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Alarma with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Alarma if signed in', function (done) {
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

        // Save a new Alarma
        agent.post('/api/alarmas')
          .send(alarma)
          .expect(200)
          .end(function (alarmaSaveErr, alarmaSaveRes) {
            // Handle Alarma save error
            if (alarmaSaveErr) {
              return done(alarmaSaveErr);
            }

            // Delete an existing Alarma
            agent.delete('/api/alarmas/' + alarmaSaveRes.body._id)
              .send(alarma)
              .expect(200)
              .end(function (alarmaDeleteErr, alarmaDeleteRes) {
                // Handle alarma error error
                if (alarmaDeleteErr) {
                  return done(alarmaDeleteErr);
                }

                // Set assertions
                (alarmaDeleteRes.body._id).should.equal(alarmaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Alarma if not signed in', function (done) {
    // Set Alarma user
    alarma.user = user;

    // Create new Alarma model instance
    var alarmaObj = new Alarma(alarma);

    // Save the Alarma
    alarmaObj.save(function () {
      // Try deleting Alarma
      request(app).delete('/api/alarmas/' + alarmaObj._id)
        .expect(403)
        .end(function (alarmaDeleteErr, alarmaDeleteRes) {
          // Set message assertion
          (alarmaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Alarma error error
          done(alarmaDeleteErr);
        });

    });
  });

  it('should be able to get a single Alarma that has an orphaned user reference', function (done) {
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

          // Save a new Alarma
          agent.post('/api/alarmas')
            .send(alarma)
            .expect(200)
            .end(function (alarmaSaveErr, alarmaSaveRes) {
              // Handle Alarma save error
              if (alarmaSaveErr) {
                return done(alarmaSaveErr);
              }

              // Set assertions on new Alarma
              (alarmaSaveRes.body.name).should.equal(alarma.name);
              should.exist(alarmaSaveRes.body.user);
              should.equal(alarmaSaveRes.body.user._id, orphanId);

              // force the Alarma to have an orphaned user reference
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

                    // Get the Alarma
                    agent.get('/api/alarmas/' + alarmaSaveRes.body._id)
                      .expect(200)
                      .end(function (alarmaInfoErr, alarmaInfoRes) {
                        // Handle Alarma error
                        if (alarmaInfoErr) {
                          return done(alarmaInfoErr);
                        }

                        // Set assertions
                        (alarmaInfoRes.body._id).should.equal(alarmaSaveRes.body._id);
                        (alarmaInfoRes.body.name).should.equal(alarma.name);
                        should.equal(alarmaInfoRes.body.user, undefined);

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
      Alarma.remove().exec(done);
    });
  });
});
