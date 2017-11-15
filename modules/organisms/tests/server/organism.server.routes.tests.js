'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Organism = mongoose.model('Organism'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  organism;

/**
 * Organism routes tests
 */
describe('Organism CRUD tests', function () {

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

    // Save a user to the test db and create new Organism
    user.save(function () {
      organism = {
        name: 'Organism name'
      };

      done();
    });
  });

  it('should be able to save a Organism if logged in', function (done) {
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

        // Save a new Organism
        agent.post('/api/organisms')
          .send(organism)
          .expect(200)
          .end(function (organismSaveErr, organismSaveRes) {
            // Handle Organism save error
            if (organismSaveErr) {
              return done(organismSaveErr);
            }

            // Get a list of Organisms
            agent.get('/api/organisms')
              .end(function (organismsGetErr, organismsGetRes) {
                // Handle Organisms save error
                if (organismsGetErr) {
                  return done(organismsGetErr);
                }

                // Get Organisms list
                var organisms = organismsGetRes.body;

                // Set assertions
                (organisms[0].user._id).should.equal(userId);
                (organisms[0].name).should.match('Organism name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Organism if not logged in', function (done) {
    agent.post('/api/organisms')
      .send(organism)
      .expect(403)
      .end(function (organismSaveErr, organismSaveRes) {
        // Call the assertion callback
        done(organismSaveErr);
      });
  });

  it('should not be able to save an Organism if no name is provided', function (done) {
    // Invalidate name field
    organism.name = '';

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

        // Save a new Organism
        agent.post('/api/organisms')
          .send(organism)
          .expect(400)
          .end(function (organismSaveErr, organismSaveRes) {
            // Set message assertion
            (organismSaveRes.body.message).should.match('Please fill Organism name');

            // Handle Organism save error
            done(organismSaveErr);
          });
      });
  });

  it('should be able to update an Organism if signed in', function (done) {
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

        // Save a new Organism
        agent.post('/api/organisms')
          .send(organism)
          .expect(200)
          .end(function (organismSaveErr, organismSaveRes) {
            // Handle Organism save error
            if (organismSaveErr) {
              return done(organismSaveErr);
            }

            // Update Organism name
            organism.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Organism
            agent.put('/api/organisms/' + organismSaveRes.body._id)
              .send(organism)
              .expect(200)
              .end(function (organismUpdateErr, organismUpdateRes) {
                // Handle Organism update error
                if (organismUpdateErr) {
                  return done(organismUpdateErr);
                }

                // Set assertions
                (organismUpdateRes.body._id).should.equal(organismSaveRes.body._id);
                (organismUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Organisms if not signed in', function (done) {
    // Create new Organism model instance
    var organismObj = new Organism(organism);

    // Save the organism
    organismObj.save(function () {
      // Request Organisms
      request(app).get('/api/organisms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Organism if not signed in', function (done) {
    // Create new Organism model instance
    var organismObj = new Organism(organism);

    // Save the Organism
    organismObj.save(function () {
      request(app).get('/api/organisms/' + organismObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', organism.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Organism with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/organisms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Organism is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Organism which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Organism
    request(app).get('/api/organisms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Organism with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Organism if signed in', function (done) {
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

        // Save a new Organism
        agent.post('/api/organisms')
          .send(organism)
          .expect(200)
          .end(function (organismSaveErr, organismSaveRes) {
            // Handle Organism save error
            if (organismSaveErr) {
              return done(organismSaveErr);
            }

            // Delete an existing Organism
            agent.delete('/api/organisms/' + organismSaveRes.body._id)
              .send(organism)
              .expect(200)
              .end(function (organismDeleteErr, organismDeleteRes) {
                // Handle organism error error
                if (organismDeleteErr) {
                  return done(organismDeleteErr);
                }

                // Set assertions
                (organismDeleteRes.body._id).should.equal(organismSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Organism if not signed in', function (done) {
    // Set Organism user
    organism.user = user;

    // Create new Organism model instance
    var organismObj = new Organism(organism);

    // Save the Organism
    organismObj.save(function () {
      // Try deleting Organism
      request(app).delete('/api/organisms/' + organismObj._id)
        .expect(403)
        .end(function (organismDeleteErr, organismDeleteRes) {
          // Set message assertion
          (organismDeleteRes.body.message).should.match('User is not authorized');

          // Handle Organism error error
          done(organismDeleteErr);
        });

    });
  });

  it('should be able to get a single Organism that has an orphaned user reference', function (done) {
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

          // Save a new Organism
          agent.post('/api/organisms')
            .send(organism)
            .expect(200)
            .end(function (organismSaveErr, organismSaveRes) {
              // Handle Organism save error
              if (organismSaveErr) {
                return done(organismSaveErr);
              }

              // Set assertions on new Organism
              (organismSaveRes.body.name).should.equal(organism.name);
              should.exist(organismSaveRes.body.user);
              should.equal(organismSaveRes.body.user._id, orphanId);

              // force the Organism to have an orphaned user reference
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

                    // Get the Organism
                    agent.get('/api/organisms/' + organismSaveRes.body._id)
                      .expect(200)
                      .end(function (organismInfoErr, organismInfoRes) {
                        // Handle Organism error
                        if (organismInfoErr) {
                          return done(organismInfoErr);
                        }

                        // Set assertions
                        (organismInfoRes.body._id).should.equal(organismSaveRes.body._id);
                        (organismInfoRes.body.name).should.equal(organism.name);
                        should.equal(organismInfoRes.body.user, undefined);

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
      Organism.remove().exec(done);
    });
  });
});
