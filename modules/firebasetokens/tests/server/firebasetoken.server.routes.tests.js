'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Firebasetoken = mongoose.model('Firebasetoken'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  firebasetoken;

/**
 * Firebasetoken routes tests
 */
describe('Firebasetoken CRUD tests', function () {

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

    // Save a user to the test db and create new Firebasetoken
    user.save(function () {
      firebasetoken = {
        name: 'Firebasetoken name'
      };

      done();
    });
  });

  it('should be able to save a Firebasetoken if logged in', function (done) {
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

        // Save a new Firebasetoken
        agent.post('/api/firebasetokens')
          .send(firebasetoken)
          .expect(200)
          .end(function (firebasetokenSaveErr, firebasetokenSaveRes) {
            // Handle Firebasetoken save error
            if (firebasetokenSaveErr) {
              return done(firebasetokenSaveErr);
            }

            // Get a list of Firebasetokens
            agent.get('/api/firebasetokens')
              .end(function (firebasetokensGetErr, firebasetokensGetRes) {
                // Handle Firebasetokens save error
                if (firebasetokensGetErr) {
                  return done(firebasetokensGetErr);
                }

                // Get Firebasetokens list
                var firebasetokens = firebasetokensGetRes.body;

                // Set assertions
                (firebasetokens[0].user._id).should.equal(userId);
                (firebasetokens[0].name).should.match('Firebasetoken name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Firebasetoken if not logged in', function (done) {
    agent.post('/api/firebasetokens')
      .send(firebasetoken)
      .expect(403)
      .end(function (firebasetokenSaveErr, firebasetokenSaveRes) {
        // Call the assertion callback
        done(firebasetokenSaveErr);
      });
  });

  it('should not be able to save an Firebasetoken if no name is provided', function (done) {
    // Invalidate name field
    firebasetoken.name = '';

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

        // Save a new Firebasetoken
        agent.post('/api/firebasetokens')
          .send(firebasetoken)
          .expect(400)
          .end(function (firebasetokenSaveErr, firebasetokenSaveRes) {
            // Set message assertion
            (firebasetokenSaveRes.body.message).should.match('Please fill Firebasetoken name');

            // Handle Firebasetoken save error
            done(firebasetokenSaveErr);
          });
      });
  });

  it('should be able to update an Firebasetoken if signed in', function (done) {
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

        // Save a new Firebasetoken
        agent.post('/api/firebasetokens')
          .send(firebasetoken)
          .expect(200)
          .end(function (firebasetokenSaveErr, firebasetokenSaveRes) {
            // Handle Firebasetoken save error
            if (firebasetokenSaveErr) {
              return done(firebasetokenSaveErr);
            }

            // Update Firebasetoken name
            firebasetoken.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Firebasetoken
            agent.put('/api/firebasetokens/' + firebasetokenSaveRes.body._id)
              .send(firebasetoken)
              .expect(200)
              .end(function (firebasetokenUpdateErr, firebasetokenUpdateRes) {
                // Handle Firebasetoken update error
                if (firebasetokenUpdateErr) {
                  return done(firebasetokenUpdateErr);
                }

                // Set assertions
                (firebasetokenUpdateRes.body._id).should.equal(firebasetokenSaveRes.body._id);
                (firebasetokenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Firebasetokens if not signed in', function (done) {
    // Create new Firebasetoken model instance
    var firebasetokenObj = new Firebasetoken(firebasetoken);

    // Save the firebasetoken
    firebasetokenObj.save(function () {
      // Request Firebasetokens
      request(app).get('/api/firebasetokens')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Firebasetoken if not signed in', function (done) {
    // Create new Firebasetoken model instance
    var firebasetokenObj = new Firebasetoken(firebasetoken);

    // Save the Firebasetoken
    firebasetokenObj.save(function () {
      request(app).get('/api/firebasetokens/' + firebasetokenObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', firebasetoken.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Firebasetoken with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/firebasetokens/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Firebasetoken is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Firebasetoken which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Firebasetoken
    request(app).get('/api/firebasetokens/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Firebasetoken with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Firebasetoken if signed in', function (done) {
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

        // Save a new Firebasetoken
        agent.post('/api/firebasetokens')
          .send(firebasetoken)
          .expect(200)
          .end(function (firebasetokenSaveErr, firebasetokenSaveRes) {
            // Handle Firebasetoken save error
            if (firebasetokenSaveErr) {
              return done(firebasetokenSaveErr);
            }

            // Delete an existing Firebasetoken
            agent.delete('/api/firebasetokens/' + firebasetokenSaveRes.body._id)
              .send(firebasetoken)
              .expect(200)
              .end(function (firebasetokenDeleteErr, firebasetokenDeleteRes) {
                // Handle firebasetoken error error
                if (firebasetokenDeleteErr) {
                  return done(firebasetokenDeleteErr);
                }

                // Set assertions
                (firebasetokenDeleteRes.body._id).should.equal(firebasetokenSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Firebasetoken if not signed in', function (done) {
    // Set Firebasetoken user
    firebasetoken.user = user;

    // Create new Firebasetoken model instance
    var firebasetokenObj = new Firebasetoken(firebasetoken);

    // Save the Firebasetoken
    firebasetokenObj.save(function () {
      // Try deleting Firebasetoken
      request(app).delete('/api/firebasetokens/' + firebasetokenObj._id)
        .expect(403)
        .end(function (firebasetokenDeleteErr, firebasetokenDeleteRes) {
          // Set message assertion
          (firebasetokenDeleteRes.body.message).should.match('User is not authorized');

          // Handle Firebasetoken error error
          done(firebasetokenDeleteErr);
        });

    });
  });

  it('should be able to get a single Firebasetoken that has an orphaned user reference', function (done) {
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

          // Save a new Firebasetoken
          agent.post('/api/firebasetokens')
            .send(firebasetoken)
            .expect(200)
            .end(function (firebasetokenSaveErr, firebasetokenSaveRes) {
              // Handle Firebasetoken save error
              if (firebasetokenSaveErr) {
                return done(firebasetokenSaveErr);
              }

              // Set assertions on new Firebasetoken
              (firebasetokenSaveRes.body.name).should.equal(firebasetoken.name);
              should.exist(firebasetokenSaveRes.body.user);
              should.equal(firebasetokenSaveRes.body.user._id, orphanId);

              // force the Firebasetoken to have an orphaned user reference
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

                    // Get the Firebasetoken
                    agent.get('/api/firebasetokens/' + firebasetokenSaveRes.body._id)
                      .expect(200)
                      .end(function (firebasetokenInfoErr, firebasetokenInfoRes) {
                        // Handle Firebasetoken error
                        if (firebasetokenInfoErr) {
                          return done(firebasetokenInfoErr);
                        }

                        // Set assertions
                        (firebasetokenInfoRes.body._id).should.equal(firebasetokenSaveRes.body._id);
                        (firebasetokenInfoRes.body.name).should.equal(firebasetoken.name);
                        should.equal(firebasetokenInfoRes.body.user, undefined);

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
      Firebasetoken.remove().exec(done);
    });
  });
});
