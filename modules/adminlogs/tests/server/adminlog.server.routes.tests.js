'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminlog = mongoose.model('Adminlog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adminlog;

/**
 * Adminlog routes tests
 */
describe('Adminlog CRUD tests', function () {

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

    // Save a user to the test db and create new Adminlog
    user.save(function () {
      adminlog = {
        name: 'Adminlog name'
      };

      done();
    });
  });

  it('should be able to save a Adminlog if logged in', function (done) {
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

        // Save a new Adminlog
        agent.post('/api/adminlogs')
          .send(adminlog)
          .expect(200)
          .end(function (adminlogSaveErr, adminlogSaveRes) {
            // Handle Adminlog save error
            if (adminlogSaveErr) {
              return done(adminlogSaveErr);
            }

            // Get a list of Adminlogs
            agent.get('/api/adminlogs')
              .end(function (adminlogsGetErr, adminlogsGetRes) {
                // Handle Adminlogs save error
                if (adminlogsGetErr) {
                  return done(adminlogsGetErr);
                }

                // Get Adminlogs list
                var adminlogs = adminlogsGetRes.body;

                // Set assertions
                (adminlogs[0].user._id).should.equal(userId);
                (adminlogs[0].name).should.match('Adminlog name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adminlog if not logged in', function (done) {
    agent.post('/api/adminlogs')
      .send(adminlog)
      .expect(403)
      .end(function (adminlogSaveErr, adminlogSaveRes) {
        // Call the assertion callback
        done(adminlogSaveErr);
      });
  });

  it('should not be able to save an Adminlog if no name is provided', function (done) {
    // Invalidate name field
    adminlog.name = '';

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

        // Save a new Adminlog
        agent.post('/api/adminlogs')
          .send(adminlog)
          .expect(400)
          .end(function (adminlogSaveErr, adminlogSaveRes) {
            // Set message assertion
            (adminlogSaveRes.body.message).should.match('Please fill Adminlog name');

            // Handle Adminlog save error
            done(adminlogSaveErr);
          });
      });
  });

  it('should be able to update an Adminlog if signed in', function (done) {
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

        // Save a new Adminlog
        agent.post('/api/adminlogs')
          .send(adminlog)
          .expect(200)
          .end(function (adminlogSaveErr, adminlogSaveRes) {
            // Handle Adminlog save error
            if (adminlogSaveErr) {
              return done(adminlogSaveErr);
            }

            // Update Adminlog name
            adminlog.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adminlog
            agent.put('/api/adminlogs/' + adminlogSaveRes.body._id)
              .send(adminlog)
              .expect(200)
              .end(function (adminlogUpdateErr, adminlogUpdateRes) {
                // Handle Adminlog update error
                if (adminlogUpdateErr) {
                  return done(adminlogUpdateErr);
                }

                // Set assertions
                (adminlogUpdateRes.body._id).should.equal(adminlogSaveRes.body._id);
                (adminlogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adminlogs if not signed in', function (done) {
    // Create new Adminlog model instance
    var adminlogObj = new Adminlog(adminlog);

    // Save the adminlog
    adminlogObj.save(function () {
      // Request Adminlogs
      request(app).get('/api/adminlogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adminlog if not signed in', function (done) {
    // Create new Adminlog model instance
    var adminlogObj = new Adminlog(adminlog);

    // Save the Adminlog
    adminlogObj.save(function () {
      request(app).get('/api/adminlogs/' + adminlogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adminlog.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adminlog with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adminlogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adminlog is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adminlog which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adminlog
    request(app).get('/api/adminlogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adminlog with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adminlog if signed in', function (done) {
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

        // Save a new Adminlog
        agent.post('/api/adminlogs')
          .send(adminlog)
          .expect(200)
          .end(function (adminlogSaveErr, adminlogSaveRes) {
            // Handle Adminlog save error
            if (adminlogSaveErr) {
              return done(adminlogSaveErr);
            }

            // Delete an existing Adminlog
            agent.delete('/api/adminlogs/' + adminlogSaveRes.body._id)
              .send(adminlog)
              .expect(200)
              .end(function (adminlogDeleteErr, adminlogDeleteRes) {
                // Handle adminlog error error
                if (adminlogDeleteErr) {
                  return done(adminlogDeleteErr);
                }

                // Set assertions
                (adminlogDeleteRes.body._id).should.equal(adminlogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adminlog if not signed in', function (done) {
    // Set Adminlog user
    adminlog.user = user;

    // Create new Adminlog model instance
    var adminlogObj = new Adminlog(adminlog);

    // Save the Adminlog
    adminlogObj.save(function () {
      // Try deleting Adminlog
      request(app).delete('/api/adminlogs/' + adminlogObj._id)
        .expect(403)
        .end(function (adminlogDeleteErr, adminlogDeleteRes) {
          // Set message assertion
          (adminlogDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adminlog error error
          done(adminlogDeleteErr);
        });

    });
  });

  it('should be able to get a single Adminlog that has an orphaned user reference', function (done) {
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

          // Save a new Adminlog
          agent.post('/api/adminlogs')
            .send(adminlog)
            .expect(200)
            .end(function (adminlogSaveErr, adminlogSaveRes) {
              // Handle Adminlog save error
              if (adminlogSaveErr) {
                return done(adminlogSaveErr);
              }

              // Set assertions on new Adminlog
              (adminlogSaveRes.body.name).should.equal(adminlog.name);
              should.exist(adminlogSaveRes.body.user);
              should.equal(adminlogSaveRes.body.user._id, orphanId);

              // force the Adminlog to have an orphaned user reference
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

                    // Get the Adminlog
                    agent.get('/api/adminlogs/' + adminlogSaveRes.body._id)
                      .expect(200)
                      .end(function (adminlogInfoErr, adminlogInfoRes) {
                        // Handle Adminlog error
                        if (adminlogInfoErr) {
                          return done(adminlogInfoErr);
                        }

                        // Set assertions
                        (adminlogInfoRes.body._id).should.equal(adminlogSaveRes.body._id);
                        (adminlogInfoRes.body.name).should.equal(adminlog.name);
                        should.equal(adminlogInfoRes.body.user, undefined);

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
      Adminlog.remove().exec(done);
    });
  });
});
