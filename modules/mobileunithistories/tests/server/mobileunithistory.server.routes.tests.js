'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mobileunithistory = mongoose.model('Mobileunithistory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  mobileunithistory;

/**
 * Mobileunithistory routes tests
 */
describe('Mobileunithistory CRUD tests', function () {

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

    // Save a user to the test db and create new Mobileunithistory
    user.save(function () {
      mobileunithistory = {
        name: 'Mobileunithistory name'
      };

      done();
    });
  });

  it('should be able to save a Mobileunithistory if logged in', function (done) {
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

        // Save a new Mobileunithistory
        agent.post('/api/mobileunithistories')
          .send(mobileunithistory)
          .expect(200)
          .end(function (mobileunithistorySaveErr, mobileunithistorySaveRes) {
            // Handle Mobileunithistory save error
            if (mobileunithistorySaveErr) {
              return done(mobileunithistorySaveErr);
            }

            // Get a list of Mobileunithistories
            agent.get('/api/mobileunithistories')
              .end(function (mobileunithistoriesGetErr, mobileunithistoriesGetRes) {
                // Handle Mobileunithistories save error
                if (mobileunithistoriesGetErr) {
                  return done(mobileunithistoriesGetErr);
                }

                // Get Mobileunithistories list
                var mobileunithistories = mobileunithistoriesGetRes.body;

                // Set assertions
                (mobileunithistories[0].user._id).should.equal(userId);
                (mobileunithistories[0].name).should.match('Mobileunithistory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mobileunithistory if not logged in', function (done) {
    agent.post('/api/mobileunithistories')
      .send(mobileunithistory)
      .expect(403)
      .end(function (mobileunithistorySaveErr, mobileunithistorySaveRes) {
        // Call the assertion callback
        done(mobileunithistorySaveErr);
      });
  });

  it('should not be able to save an Mobileunithistory if no name is provided', function (done) {
    // Invalidate name field
    mobileunithistory.name = '';

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

        // Save a new Mobileunithistory
        agent.post('/api/mobileunithistories')
          .send(mobileunithistory)
          .expect(400)
          .end(function (mobileunithistorySaveErr, mobileunithistorySaveRes) {
            // Set message assertion
            (mobileunithistorySaveRes.body.message).should.match('Please fill Mobileunithistory name');

            // Handle Mobileunithistory save error
            done(mobileunithistorySaveErr);
          });
      });
  });

  it('should be able to update an Mobileunithistory if signed in', function (done) {
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

        // Save a new Mobileunithistory
        agent.post('/api/mobileunithistories')
          .send(mobileunithistory)
          .expect(200)
          .end(function (mobileunithistorySaveErr, mobileunithistorySaveRes) {
            // Handle Mobileunithistory save error
            if (mobileunithistorySaveErr) {
              return done(mobileunithistorySaveErr);
            }

            // Update Mobileunithistory name
            mobileunithistory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mobileunithistory
            agent.put('/api/mobileunithistories/' + mobileunithistorySaveRes.body._id)
              .send(mobileunithistory)
              .expect(200)
              .end(function (mobileunithistoryUpdateErr, mobileunithistoryUpdateRes) {
                // Handle Mobileunithistory update error
                if (mobileunithistoryUpdateErr) {
                  return done(mobileunithistoryUpdateErr);
                }

                // Set assertions
                (mobileunithistoryUpdateRes.body._id).should.equal(mobileunithistorySaveRes.body._id);
                (mobileunithistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mobileunithistories if not signed in', function (done) {
    // Create new Mobileunithistory model instance
    var mobileunithistoryObj = new Mobileunithistory(mobileunithistory);

    // Save the mobileunithistory
    mobileunithistoryObj.save(function () {
      // Request Mobileunithistories
      request(app).get('/api/mobileunithistories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mobileunithistory if not signed in', function (done) {
    // Create new Mobileunithistory model instance
    var mobileunithistoryObj = new Mobileunithistory(mobileunithistory);

    // Save the Mobileunithistory
    mobileunithistoryObj.save(function () {
      request(app).get('/api/mobileunithistories/' + mobileunithistoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mobileunithistory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mobileunithistory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mobileunithistories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mobileunithistory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mobileunithistory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mobileunithistory
    request(app).get('/api/mobileunithistories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mobileunithistory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mobileunithistory if signed in', function (done) {
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

        // Save a new Mobileunithistory
        agent.post('/api/mobileunithistories')
          .send(mobileunithistory)
          .expect(200)
          .end(function (mobileunithistorySaveErr, mobileunithistorySaveRes) {
            // Handle Mobileunithistory save error
            if (mobileunithistorySaveErr) {
              return done(mobileunithistorySaveErr);
            }

            // Delete an existing Mobileunithistory
            agent.delete('/api/mobileunithistories/' + mobileunithistorySaveRes.body._id)
              .send(mobileunithistory)
              .expect(200)
              .end(function (mobileunithistoryDeleteErr, mobileunithistoryDeleteRes) {
                // Handle mobileunithistory error error
                if (mobileunithistoryDeleteErr) {
                  return done(mobileunithistoryDeleteErr);
                }

                // Set assertions
                (mobileunithistoryDeleteRes.body._id).should.equal(mobileunithistorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mobileunithistory if not signed in', function (done) {
    // Set Mobileunithistory user
    mobileunithistory.user = user;

    // Create new Mobileunithistory model instance
    var mobileunithistoryObj = new Mobileunithistory(mobileunithistory);

    // Save the Mobileunithistory
    mobileunithistoryObj.save(function () {
      // Try deleting Mobileunithistory
      request(app).delete('/api/mobileunithistories/' + mobileunithistoryObj._id)
        .expect(403)
        .end(function (mobileunithistoryDeleteErr, mobileunithistoryDeleteRes) {
          // Set message assertion
          (mobileunithistoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mobileunithistory error error
          done(mobileunithistoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Mobileunithistory that has an orphaned user reference', function (done) {
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

          // Save a new Mobileunithistory
          agent.post('/api/mobileunithistories')
            .send(mobileunithistory)
            .expect(200)
            .end(function (mobileunithistorySaveErr, mobileunithistorySaveRes) {
              // Handle Mobileunithistory save error
              if (mobileunithistorySaveErr) {
                return done(mobileunithistorySaveErr);
              }

              // Set assertions on new Mobileunithistory
              (mobileunithistorySaveRes.body.name).should.equal(mobileunithistory.name);
              should.exist(mobileunithistorySaveRes.body.user);
              should.equal(mobileunithistorySaveRes.body.user._id, orphanId);

              // force the Mobileunithistory to have an orphaned user reference
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

                    // Get the Mobileunithistory
                    agent.get('/api/mobileunithistories/' + mobileunithistorySaveRes.body._id)
                      .expect(200)
                      .end(function (mobileunithistoryInfoErr, mobileunithistoryInfoRes) {
                        // Handle Mobileunithistory error
                        if (mobileunithistoryInfoErr) {
                          return done(mobileunithistoryInfoErr);
                        }

                        // Set assertions
                        (mobileunithistoryInfoRes.body._id).should.equal(mobileunithistorySaveRes.body._id);
                        (mobileunithistoryInfoRes.body.name).should.equal(mobileunithistory.name);
                        should.equal(mobileunithistoryInfoRes.body.user, undefined);

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
      Mobileunithistory.remove().exec(done);
    });
  });
});
