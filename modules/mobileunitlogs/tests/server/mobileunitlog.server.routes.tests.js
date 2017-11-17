'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mobileunitlog = mongoose.model('Mobileunitlog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  mobileunitlog;

/**
 * Mobileunitlog routes tests
 */
describe('Mobileunitlog CRUD tests', function () {

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

    // Save a user to the test db and create new Mobileunitlog
    user.save(function () {
      mobileunitlog = {
        name: 'Mobileunitlog name'
      };

      done();
    });
  });

  it('should be able to save a Mobileunitlog if logged in', function (done) {
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

        // Save a new Mobileunitlog
        agent.post('/api/mobileunitlogs')
          .send(mobileunitlog)
          .expect(200)
          .end(function (mobileunitlogSaveErr, mobileunitlogSaveRes) {
            // Handle Mobileunitlog save error
            if (mobileunitlogSaveErr) {
              return done(mobileunitlogSaveErr);
            }

            // Get a list of Mobileunitlogs
            agent.get('/api/mobileunitlogs')
              .end(function (mobileunitlogsGetErr, mobileunitlogsGetRes) {
                // Handle Mobileunitlogs save error
                if (mobileunitlogsGetErr) {
                  return done(mobileunitlogsGetErr);
                }

                // Get Mobileunitlogs list
                var mobileunitlogs = mobileunitlogsGetRes.body;

                // Set assertions
                (mobileunitlogs[0].user._id).should.equal(userId);
                (mobileunitlogs[0].name).should.match('Mobileunitlog name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mobileunitlog if not logged in', function (done) {
    agent.post('/api/mobileunitlogs')
      .send(mobileunitlog)
      .expect(403)
      .end(function (mobileunitlogSaveErr, mobileunitlogSaveRes) {
        // Call the assertion callback
        done(mobileunitlogSaveErr);
      });
  });

  it('should not be able to save an Mobileunitlog if no name is provided', function (done) {
    // Invalidate name field
    mobileunitlog.name = '';

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

        // Save a new Mobileunitlog
        agent.post('/api/mobileunitlogs')
          .send(mobileunitlog)
          .expect(400)
          .end(function (mobileunitlogSaveErr, mobileunitlogSaveRes) {
            // Set message assertion
            (mobileunitlogSaveRes.body.message).should.match('Please fill Mobileunitlog name');

            // Handle Mobileunitlog save error
            done(mobileunitlogSaveErr);
          });
      });
  });

  it('should be able to update an Mobileunitlog if signed in', function (done) {
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

        // Save a new Mobileunitlog
        agent.post('/api/mobileunitlogs')
          .send(mobileunitlog)
          .expect(200)
          .end(function (mobileunitlogSaveErr, mobileunitlogSaveRes) {
            // Handle Mobileunitlog save error
            if (mobileunitlogSaveErr) {
              return done(mobileunitlogSaveErr);
            }

            // Update Mobileunitlog name
            mobileunitlog.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mobileunitlog
            agent.put('/api/mobileunitlogs/' + mobileunitlogSaveRes.body._id)
              .send(mobileunitlog)
              .expect(200)
              .end(function (mobileunitlogUpdateErr, mobileunitlogUpdateRes) {
                // Handle Mobileunitlog update error
                if (mobileunitlogUpdateErr) {
                  return done(mobileunitlogUpdateErr);
                }

                // Set assertions
                (mobileunitlogUpdateRes.body._id).should.equal(mobileunitlogSaveRes.body._id);
                (mobileunitlogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mobileunitlogs if not signed in', function (done) {
    // Create new Mobileunitlog model instance
    var mobileunitlogObj = new Mobileunitlog(mobileunitlog);

    // Save the mobileunitlog
    mobileunitlogObj.save(function () {
      // Request Mobileunitlogs
      request(app).get('/api/mobileunitlogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mobileunitlog if not signed in', function (done) {
    // Create new Mobileunitlog model instance
    var mobileunitlogObj = new Mobileunitlog(mobileunitlog);

    // Save the Mobileunitlog
    mobileunitlogObj.save(function () {
      request(app).get('/api/mobileunitlogs/' + mobileunitlogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mobileunitlog.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mobileunitlog with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mobileunitlogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mobileunitlog is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mobileunitlog which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mobileunitlog
    request(app).get('/api/mobileunitlogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mobileunitlog with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mobileunitlog if signed in', function (done) {
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

        // Save a new Mobileunitlog
        agent.post('/api/mobileunitlogs')
          .send(mobileunitlog)
          .expect(200)
          .end(function (mobileunitlogSaveErr, mobileunitlogSaveRes) {
            // Handle Mobileunitlog save error
            if (mobileunitlogSaveErr) {
              return done(mobileunitlogSaveErr);
            }

            // Delete an existing Mobileunitlog
            agent.delete('/api/mobileunitlogs/' + mobileunitlogSaveRes.body._id)
              .send(mobileunitlog)
              .expect(200)
              .end(function (mobileunitlogDeleteErr, mobileunitlogDeleteRes) {
                // Handle mobileunitlog error error
                if (mobileunitlogDeleteErr) {
                  return done(mobileunitlogDeleteErr);
                }

                // Set assertions
                (mobileunitlogDeleteRes.body._id).should.equal(mobileunitlogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mobileunitlog if not signed in', function (done) {
    // Set Mobileunitlog user
    mobileunitlog.user = user;

    // Create new Mobileunitlog model instance
    var mobileunitlogObj = new Mobileunitlog(mobileunitlog);

    // Save the Mobileunitlog
    mobileunitlogObj.save(function () {
      // Try deleting Mobileunitlog
      request(app).delete('/api/mobileunitlogs/' + mobileunitlogObj._id)
        .expect(403)
        .end(function (mobileunitlogDeleteErr, mobileunitlogDeleteRes) {
          // Set message assertion
          (mobileunitlogDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mobileunitlog error error
          done(mobileunitlogDeleteErr);
        });

    });
  });

  it('should be able to get a single Mobileunitlog that has an orphaned user reference', function (done) {
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

          // Save a new Mobileunitlog
          agent.post('/api/mobileunitlogs')
            .send(mobileunitlog)
            .expect(200)
            .end(function (mobileunitlogSaveErr, mobileunitlogSaveRes) {
              // Handle Mobileunitlog save error
              if (mobileunitlogSaveErr) {
                return done(mobileunitlogSaveErr);
              }

              // Set assertions on new Mobileunitlog
              (mobileunitlogSaveRes.body.name).should.equal(mobileunitlog.name);
              should.exist(mobileunitlogSaveRes.body.user);
              should.equal(mobileunitlogSaveRes.body.user._id, orphanId);

              // force the Mobileunitlog to have an orphaned user reference
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

                    // Get the Mobileunitlog
                    agent.get('/api/mobileunitlogs/' + mobileunitlogSaveRes.body._id)
                      .expect(200)
                      .end(function (mobileunitlogInfoErr, mobileunitlogInfoRes) {
                        // Handle Mobileunitlog error
                        if (mobileunitlogInfoErr) {
                          return done(mobileunitlogInfoErr);
                        }

                        // Set assertions
                        (mobileunitlogInfoRes.body._id).should.equal(mobileunitlogSaveRes.body._id);
                        (mobileunitlogInfoRes.body.name).should.equal(mobileunitlog.name);
                        should.equal(mobileunitlogInfoRes.body.user, undefined);

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
      Mobileunitlog.remove().exec(done);
    });
  });
});
