'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categoriaservicio = mongoose.model('Categoriaservicio'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  categoriaservicio;

/**
 * Categoriaservicio routes tests
 */
describe('Categoriaservicio CRUD tests', function () {

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

    // Save a user to the test db and create new Categoriaservicio
    user.save(function () {
      categoriaservicio = {
        name: 'Categoriaservicio name'
      };

      done();
    });
  });

  it('should be able to save a Categoriaservicio if logged in', function (done) {
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

        // Save a new Categoriaservicio
        agent.post('/api/categoriaservicios')
          .send(categoriaservicio)
          .expect(200)
          .end(function (categoriaservicioSaveErr, categoriaservicioSaveRes) {
            // Handle Categoriaservicio save error
            if (categoriaservicioSaveErr) {
              return done(categoriaservicioSaveErr);
            }

            // Get a list of Categoriaservicios
            agent.get('/api/categoriaservicios')
              .end(function (categoriaserviciosGetErr, categoriaserviciosGetRes) {
                // Handle Categoriaservicios save error
                if (categoriaserviciosGetErr) {
                  return done(categoriaserviciosGetErr);
                }

                // Get Categoriaservicios list
                var categoriaservicios = categoriaserviciosGetRes.body;

                // Set assertions
                (categoriaservicios[0].user._id).should.equal(userId);
                (categoriaservicios[0].name).should.match('Categoriaservicio name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Categoriaservicio if not logged in', function (done) {
    agent.post('/api/categoriaservicios')
      .send(categoriaservicio)
      .expect(403)
      .end(function (categoriaservicioSaveErr, categoriaservicioSaveRes) {
        // Call the assertion callback
        done(categoriaservicioSaveErr);
      });
  });

  it('should not be able to save an Categoriaservicio if no name is provided', function (done) {
    // Invalidate name field
    categoriaservicio.name = '';

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

        // Save a new Categoriaservicio
        agent.post('/api/categoriaservicios')
          .send(categoriaservicio)
          .expect(400)
          .end(function (categoriaservicioSaveErr, categoriaservicioSaveRes) {
            // Set message assertion
            (categoriaservicioSaveRes.body.message).should.match('Please fill Categoriaservicio name');

            // Handle Categoriaservicio save error
            done(categoriaservicioSaveErr);
          });
      });
  });

  it('should be able to update an Categoriaservicio if signed in', function (done) {
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

        // Save a new Categoriaservicio
        agent.post('/api/categoriaservicios')
          .send(categoriaservicio)
          .expect(200)
          .end(function (categoriaservicioSaveErr, categoriaservicioSaveRes) {
            // Handle Categoriaservicio save error
            if (categoriaservicioSaveErr) {
              return done(categoriaservicioSaveErr);
            }

            // Update Categoriaservicio name
            categoriaservicio.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Categoriaservicio
            agent.put('/api/categoriaservicios/' + categoriaservicioSaveRes.body._id)
              .send(categoriaservicio)
              .expect(200)
              .end(function (categoriaservicioUpdateErr, categoriaservicioUpdateRes) {
                // Handle Categoriaservicio update error
                if (categoriaservicioUpdateErr) {
                  return done(categoriaservicioUpdateErr);
                }

                // Set assertions
                (categoriaservicioUpdateRes.body._id).should.equal(categoriaservicioSaveRes.body._id);
                (categoriaservicioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Categoriaservicios if not signed in', function (done) {
    // Create new Categoriaservicio model instance
    var categoriaservicioObj = new Categoriaservicio(categoriaservicio);

    // Save the categoriaservicio
    categoriaservicioObj.save(function () {
      // Request Categoriaservicios
      request(app).get('/api/categoriaservicios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Categoriaservicio if not signed in', function (done) {
    // Create new Categoriaservicio model instance
    var categoriaservicioObj = new Categoriaservicio(categoriaservicio);

    // Save the Categoriaservicio
    categoriaservicioObj.save(function () {
      request(app).get('/api/categoriaservicios/' + categoriaservicioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', categoriaservicio.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Categoriaservicio with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categoriaservicios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Categoriaservicio is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Categoriaservicio which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Categoriaservicio
    request(app).get('/api/categoriaservicios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Categoriaservicio with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Categoriaservicio if signed in', function (done) {
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

        // Save a new Categoriaservicio
        agent.post('/api/categoriaservicios')
          .send(categoriaservicio)
          .expect(200)
          .end(function (categoriaservicioSaveErr, categoriaservicioSaveRes) {
            // Handle Categoriaservicio save error
            if (categoriaservicioSaveErr) {
              return done(categoriaservicioSaveErr);
            }

            // Delete an existing Categoriaservicio
            agent.delete('/api/categoriaservicios/' + categoriaservicioSaveRes.body._id)
              .send(categoriaservicio)
              .expect(200)
              .end(function (categoriaservicioDeleteErr, categoriaservicioDeleteRes) {
                // Handle categoriaservicio error error
                if (categoriaservicioDeleteErr) {
                  return done(categoriaservicioDeleteErr);
                }

                // Set assertions
                (categoriaservicioDeleteRes.body._id).should.equal(categoriaservicioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Categoriaservicio if not signed in', function (done) {
    // Set Categoriaservicio user
    categoriaservicio.user = user;

    // Create new Categoriaservicio model instance
    var categoriaservicioObj = new Categoriaservicio(categoriaservicio);

    // Save the Categoriaservicio
    categoriaservicioObj.save(function () {
      // Try deleting Categoriaservicio
      request(app).delete('/api/categoriaservicios/' + categoriaservicioObj._id)
        .expect(403)
        .end(function (categoriaservicioDeleteErr, categoriaservicioDeleteRes) {
          // Set message assertion
          (categoriaservicioDeleteRes.body.message).should.match('User is not authorized');

          // Handle Categoriaservicio error error
          done(categoriaservicioDeleteErr);
        });

    });
  });

  it('should be able to get a single Categoriaservicio that has an orphaned user reference', function (done) {
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

          // Save a new Categoriaservicio
          agent.post('/api/categoriaservicios')
            .send(categoriaservicio)
            .expect(200)
            .end(function (categoriaservicioSaveErr, categoriaservicioSaveRes) {
              // Handle Categoriaservicio save error
              if (categoriaservicioSaveErr) {
                return done(categoriaservicioSaveErr);
              }

              // Set assertions on new Categoriaservicio
              (categoriaservicioSaveRes.body.name).should.equal(categoriaservicio.name);
              should.exist(categoriaservicioSaveRes.body.user);
              should.equal(categoriaservicioSaveRes.body.user._id, orphanId);

              // force the Categoriaservicio to have an orphaned user reference
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

                    // Get the Categoriaservicio
                    agent.get('/api/categoriaservicios/' + categoriaservicioSaveRes.body._id)
                      .expect(200)
                      .end(function (categoriaservicioInfoErr, categoriaservicioInfoRes) {
                        // Handle Categoriaservicio error
                        if (categoriaservicioInfoErr) {
                          return done(categoriaservicioInfoErr);
                        }

                        // Set assertions
                        (categoriaservicioInfoRes.body._id).should.equal(categoriaservicioSaveRes.body._id);
                        (categoriaservicioInfoRes.body.name).should.equal(categoriaservicio.name);
                        should.equal(categoriaservicioInfoRes.body.user, undefined);

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
      Categoriaservicio.remove().exec(done);
    });
  });
});
