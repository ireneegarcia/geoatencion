'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Catalogo = mongoose.model('Catalogo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  catalogo;

/**
 * Catalogo routes tests
 */
describe('Catalogo CRUD tests', function () {

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

    // Save a user to the test db and create new Catalogo
    user.save(function () {
      catalogo = {
        name: 'Catalogo name'
      };

      done();
    });
  });

  it('should be able to save a Catalogo if logged in', function (done) {
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

        // Save a new Catalogo
        agent.post('/api/catalogos')
          .send(catalogo)
          .expect(200)
          .end(function (catalogoSaveErr, catalogoSaveRes) {
            // Handle Catalogo save error
            if (catalogoSaveErr) {
              return done(catalogoSaveErr);
            }

            // Get a list of Catalogos
            agent.get('/api/catalogos')
              .end(function (catalogosGetErr, catalogosGetRes) {
                // Handle Catalogos save error
                if (catalogosGetErr) {
                  return done(catalogosGetErr);
                }

                // Get Catalogos list
                var catalogos = catalogosGetRes.body;

                // Set assertions
                (catalogos[0].user._id).should.equal(userId);
                (catalogos[0].name).should.match('Catalogo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Catalogo if not logged in', function (done) {
    agent.post('/api/catalogos')
      .send(catalogo)
      .expect(403)
      .end(function (catalogoSaveErr, catalogoSaveRes) {
        // Call the assertion callback
        done(catalogoSaveErr);
      });
  });

  it('should not be able to save an Catalogo if no name is provided', function (done) {
    // Invalidate name field
    catalogo.name = '';

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

        // Save a new Catalogo
        agent.post('/api/catalogos')
          .send(catalogo)
          .expect(400)
          .end(function (catalogoSaveErr, catalogoSaveRes) {
            // Set message assertion
            (catalogoSaveRes.body.message).should.match('Please fill Catalogo name');

            // Handle Catalogo save error
            done(catalogoSaveErr);
          });
      });
  });

  it('should be able to update an Catalogo if signed in', function (done) {
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

        // Save a new Catalogo
        agent.post('/api/catalogos')
          .send(catalogo)
          .expect(200)
          .end(function (catalogoSaveErr, catalogoSaveRes) {
            // Handle Catalogo save error
            if (catalogoSaveErr) {
              return done(catalogoSaveErr);
            }

            // Update Catalogo name
            catalogo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Catalogo
            agent.put('/api/catalogos/' + catalogoSaveRes.body._id)
              .send(catalogo)
              .expect(200)
              .end(function (catalogoUpdateErr, catalogoUpdateRes) {
                // Handle Catalogo update error
                if (catalogoUpdateErr) {
                  return done(catalogoUpdateErr);
                }

                // Set assertions
                (catalogoUpdateRes.body._id).should.equal(catalogoSaveRes.body._id);
                (catalogoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Catalogos if not signed in', function (done) {
    // Create new Catalogo model instance
    var catalogoObj = new Catalogo(catalogo);

    // Save the catalogo
    catalogoObj.save(function () {
      // Request Catalogos
      request(app).get('/api/catalogos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Catalogo if not signed in', function (done) {
    // Create new Catalogo model instance
    var catalogoObj = new Catalogo(catalogo);

    // Save the Catalogo
    catalogoObj.save(function () {
      request(app).get('/api/catalogos/' + catalogoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', catalogo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Catalogo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/catalogos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Catalogo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Catalogo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Catalogo
    request(app).get('/api/catalogos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Catalogo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Catalogo if signed in', function (done) {
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

        // Save a new Catalogo
        agent.post('/api/catalogos')
          .send(catalogo)
          .expect(200)
          .end(function (catalogoSaveErr, catalogoSaveRes) {
            // Handle Catalogo save error
            if (catalogoSaveErr) {
              return done(catalogoSaveErr);
            }

            // Delete an existing Catalogo
            agent.delete('/api/catalogos/' + catalogoSaveRes.body._id)
              .send(catalogo)
              .expect(200)
              .end(function (catalogoDeleteErr, catalogoDeleteRes) {
                // Handle catalogo error error
                if (catalogoDeleteErr) {
                  return done(catalogoDeleteErr);
                }

                // Set assertions
                (catalogoDeleteRes.body._id).should.equal(catalogoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Catalogo if not signed in', function (done) {
    // Set Catalogo user
    catalogo.user = user;

    // Create new Catalogo model instance
    var catalogoObj = new Catalogo(catalogo);

    // Save the Catalogo
    catalogoObj.save(function () {
      // Try deleting Catalogo
      request(app).delete('/api/catalogos/' + catalogoObj._id)
        .expect(403)
        .end(function (catalogoDeleteErr, catalogoDeleteRes) {
          // Set message assertion
          (catalogoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Catalogo error error
          done(catalogoDeleteErr);
        });

    });
  });

  it('should be able to get a single Catalogo that has an orphaned user reference', function (done) {
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

          // Save a new Catalogo
          agent.post('/api/catalogos')
            .send(catalogo)
            .expect(200)
            .end(function (catalogoSaveErr, catalogoSaveRes) {
              // Handle Catalogo save error
              if (catalogoSaveErr) {
                return done(catalogoSaveErr);
              }

              // Set assertions on new Catalogo
              (catalogoSaveRes.body.name).should.equal(catalogo.name);
              should.exist(catalogoSaveRes.body.user);
              should.equal(catalogoSaveRes.body.user._id, orphanId);

              // force the Catalogo to have an orphaned user reference
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

                    // Get the Catalogo
                    agent.get('/api/catalogos/' + catalogoSaveRes.body._id)
                      .expect(200)
                      .end(function (catalogoInfoErr, catalogoInfoRes) {
                        // Handle Catalogo error
                        if (catalogoInfoErr) {
                          return done(catalogoInfoErr);
                        }

                        // Set assertions
                        (catalogoInfoRes.body._id).should.equal(catalogoSaveRes.body._id);
                        (catalogoInfoRes.body.name).should.equal(catalogo.name);
                        should.equal(catalogoInfoRes.body.user, undefined);

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
      Catalogo.remove().exec(done);
    });
  });
});
