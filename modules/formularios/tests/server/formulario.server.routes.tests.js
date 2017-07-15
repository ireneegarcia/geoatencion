'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Formulario = mongoose.model('Formulario'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  formulario;

/**
 * Formulario routes tests
 */
describe('Formulario CRUD tests', function () {

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

    // Save a user to the test db and create new Formulario
    user.save(function () {
      formulario = {
        name: 'Formulario name'
      };

      done();
    });
  });

  it('should be able to save a Formulario if logged in', function (done) {
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

        // Save a new Formulario
        agent.post('/api/formularios')
          .send(formulario)
          .expect(200)
          .end(function (formularioSaveErr, formularioSaveRes) {
            // Handle Formulario save error
            if (formularioSaveErr) {
              return done(formularioSaveErr);
            }

            // Get a list of Formularios
            agent.get('/api/formularios')
              .end(function (formulariosGetErr, formulariosGetRes) {
                // Handle Formularios save error
                if (formulariosGetErr) {
                  return done(formulariosGetErr);
                }

                // Get Formularios list
                var formularios = formulariosGetRes.body;

                // Set assertions
                (formularios[0].user._id).should.equal(userId);
                (formularios[0].name).should.match('Formulario name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Formulario if not logged in', function (done) {
    agent.post('/api/formularios')
      .send(formulario)
      .expect(403)
      .end(function (formularioSaveErr, formularioSaveRes) {
        // Call the assertion callback
        done(formularioSaveErr);
      });
  });

  it('should not be able to save an Formulario if no name is provided', function (done) {
    // Invalidate name field
    formulario.name = '';

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

        // Save a new Formulario
        agent.post('/api/formularios')
          .send(formulario)
          .expect(400)
          .end(function (formularioSaveErr, formularioSaveRes) {
            // Set message assertion
            (formularioSaveRes.body.message).should.match('Please fill Formulario name');

            // Handle Formulario save error
            done(formularioSaveErr);
          });
      });
  });

  it('should be able to update an Formulario if signed in', function (done) {
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

        // Save a new Formulario
        agent.post('/api/formularios')
          .send(formulario)
          .expect(200)
          .end(function (formularioSaveErr, formularioSaveRes) {
            // Handle Formulario save error
            if (formularioSaveErr) {
              return done(formularioSaveErr);
            }

            // Update Formulario name
            formulario.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Formulario
            agent.put('/api/formularios/' + formularioSaveRes.body._id)
              .send(formulario)
              .expect(200)
              .end(function (formularioUpdateErr, formularioUpdateRes) {
                // Handle Formulario update error
                if (formularioUpdateErr) {
                  return done(formularioUpdateErr);
                }

                // Set assertions
                (formularioUpdateRes.body._id).should.equal(formularioSaveRes.body._id);
                (formularioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Formularios if not signed in', function (done) {
    // Create new Formulario model instance
    var formularioObj = new Formulario(formulario);

    // Save the formulario
    formularioObj.save(function () {
      // Request Formularios
      request(app).get('/api/formularios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Formulario if not signed in', function (done) {
    // Create new Formulario model instance
    var formularioObj = new Formulario(formulario);

    // Save the Formulario
    formularioObj.save(function () {
      request(app).get('/api/formularios/' + formularioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', formulario.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Formulario with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/formularios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Formulario is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Formulario which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Formulario
    request(app).get('/api/formularios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Formulario with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Formulario if signed in', function (done) {
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

        // Save a new Formulario
        agent.post('/api/formularios')
          .send(formulario)
          .expect(200)
          .end(function (formularioSaveErr, formularioSaveRes) {
            // Handle Formulario save error
            if (formularioSaveErr) {
              return done(formularioSaveErr);
            }

            // Delete an existing Formulario
            agent.delete('/api/formularios/' + formularioSaveRes.body._id)
              .send(formulario)
              .expect(200)
              .end(function (formularioDeleteErr, formularioDeleteRes) {
                // Handle formulario error error
                if (formularioDeleteErr) {
                  return done(formularioDeleteErr);
                }

                // Set assertions
                (formularioDeleteRes.body._id).should.equal(formularioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Formulario if not signed in', function (done) {
    // Set Formulario user
    formulario.user = user;

    // Create new Formulario model instance
    var formularioObj = new Formulario(formulario);

    // Save the Formulario
    formularioObj.save(function () {
      // Try deleting Formulario
      request(app).delete('/api/formularios/' + formularioObj._id)
        .expect(403)
        .end(function (formularioDeleteErr, formularioDeleteRes) {
          // Set message assertion
          (formularioDeleteRes.body.message).should.match('User is not authorized');

          // Handle Formulario error error
          done(formularioDeleteErr);
        });

    });
  });

  it('should be able to get a single Formulario that has an orphaned user reference', function (done) {
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

          // Save a new Formulario
          agent.post('/api/formularios')
            .send(formulario)
            .expect(200)
            .end(function (formularioSaveErr, formularioSaveRes) {
              // Handle Formulario save error
              if (formularioSaveErr) {
                return done(formularioSaveErr);
              }

              // Set assertions on new Formulario
              (formularioSaveRes.body.name).should.equal(formulario.name);
              should.exist(formularioSaveRes.body.user);
              should.equal(formularioSaveRes.body.user._id, orphanId);

              // force the Formulario to have an orphaned user reference
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

                    // Get the Formulario
                    agent.get('/api/formularios/' + formularioSaveRes.body._id)
                      .expect(200)
                      .end(function (formularioInfoErr, formularioInfoRes) {
                        // Handle Formulario error
                        if (formularioInfoErr) {
                          return done(formularioInfoErr);
                        }

                        // Set assertions
                        (formularioInfoRes.body._id).should.equal(formularioSaveRes.body._id);
                        (formularioInfoRes.body.name).should.equal(formulario.name);
                        should.equal(formularioInfoRes.body.user, undefined);

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
      Formulario.remove().exec(done);
    });
  });
});
