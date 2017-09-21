'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Branch = mongoose.model('Branch'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  branch;

/**
 * Branch routes tests
 */
describe('Branch CRUD tests', function () {

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

    // Save a user to the test db and create new Branch
    user.save(function () {
      branch = {
        name: 'Branch name'
      };

      done();
    });
  });

  it('should be able to save a Branch if logged in', function (done) {
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

        // Save a new Branch
        agent.post('/api/branches')
          .send(branch)
          .expect(200)
          .end(function (branchSaveErr, branchSaveRes) {
            // Handle Branch save error
            if (branchSaveErr) {
              return done(branchSaveErr);
            }

            // Get a list of Branches
            agent.get('/api/branches')
              .end(function (branchesGetErr, branchesGetRes) {
                // Handle Branches save error
                if (branchesGetErr) {
                  return done(branchesGetErr);
                }

                // Get Branches list
                var branches = branchesGetRes.body;

                // Set assertions
                (branches[0].user._id).should.equal(userId);
                (branches[0].name).should.match('Branch name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Branch if not logged in', function (done) {
    agent.post('/api/branches')
      .send(branch)
      .expect(403)
      .end(function (branchSaveErr, branchSaveRes) {
        // Call the assertion callback
        done(branchSaveErr);
      });
  });

  it('should not be able to save an Branch if no name is provided', function (done) {
    // Invalidate name field
    branch.name = '';

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

        // Save a new Branch
        agent.post('/api/branches')
          .send(branch)
          .expect(400)
          .end(function (branchSaveErr, branchSaveRes) {
            // Set message assertion
            (branchSaveRes.body.message).should.match('Please fill Branch name');

            // Handle Branch save error
            done(branchSaveErr);
          });
      });
  });

  it('should be able to update an Branch if signed in', function (done) {
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

        // Save a new Branch
        agent.post('/api/branches')
          .send(branch)
          .expect(200)
          .end(function (branchSaveErr, branchSaveRes) {
            // Handle Branch save error
            if (branchSaveErr) {
              return done(branchSaveErr);
            }

            // Update Branch name
            branch.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Branch
            agent.put('/api/branches/' + branchSaveRes.body._id)
              .send(branch)
              .expect(200)
              .end(function (branchUpdateErr, branchUpdateRes) {
                // Handle Branch update error
                if (branchUpdateErr) {
                  return done(branchUpdateErr);
                }

                // Set assertions
                (branchUpdateRes.body._id).should.equal(branchSaveRes.body._id);
                (branchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Branches if not signed in', function (done) {
    // Create new Branch model instance
    var branchObj = new Branch(branch);

    // Save the branch
    branchObj.save(function () {
      // Request Branches
      request(app).get('/api/branches')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Branch if not signed in', function (done) {
    // Create new Branch model instance
    var branchObj = new Branch(branch);

    // Save the Branch
    branchObj.save(function () {
      request(app).get('/api/branches/' + branchObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', branch.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Branch with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/branches/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Branch is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Branch which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Branch
    request(app).get('/api/branches/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Branch with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Branch if signed in', function (done) {
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

        // Save a new Branch
        agent.post('/api/branches')
          .send(branch)
          .expect(200)
          .end(function (branchSaveErr, branchSaveRes) {
            // Handle Branch save error
            if (branchSaveErr) {
              return done(branchSaveErr);
            }

            // Delete an existing Branch
            agent.delete('/api/branches/' + branchSaveRes.body._id)
              .send(branch)
              .expect(200)
              .end(function (branchDeleteErr, branchDeleteRes) {
                // Handle branch error error
                if (branchDeleteErr) {
                  return done(branchDeleteErr);
                }

                // Set assertions
                (branchDeleteRes.body._id).should.equal(branchSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Branch if not signed in', function (done) {
    // Set Branch user
    branch.user = user;

    // Create new Branch model instance
    var branchObj = new Branch(branch);

    // Save the Branch
    branchObj.save(function () {
      // Try deleting Branch
      request(app).delete('/api/branches/' + branchObj._id)
        .expect(403)
        .end(function (branchDeleteErr, branchDeleteRes) {
          // Set message assertion
          (branchDeleteRes.body.message).should.match('User is not authorized');

          // Handle Branch error error
          done(branchDeleteErr);
        });

    });
  });

  it('should be able to get a single Branch that has an orphaned user reference', function (done) {
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

          // Save a new Branch
          agent.post('/api/branches')
            .send(branch)
            .expect(200)
            .end(function (branchSaveErr, branchSaveRes) {
              // Handle Branch save error
              if (branchSaveErr) {
                return done(branchSaveErr);
              }

              // Set assertions on new Branch
              (branchSaveRes.body.name).should.equal(branch.name);
              should.exist(branchSaveRes.body.user);
              should.equal(branchSaveRes.body.user._id, orphanId);

              // force the Branch to have an orphaned user reference
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

                    // Get the Branch
                    agent.get('/api/branches/' + branchSaveRes.body._id)
                      .expect(200)
                      .end(function (branchInfoErr, branchInfoRes) {
                        // Handle Branch error
                        if (branchInfoErr) {
                          return done(branchInfoErr);
                        }

                        // Set assertions
                        (branchInfoRes.body._id).should.equal(branchSaveRes.body._id);
                        (branchInfoRes.body.name).should.equal(branch.name);
                        should.equal(branchInfoRes.body.user, undefined);

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
      Branch.remove().exec(done);
    });
  });
});
