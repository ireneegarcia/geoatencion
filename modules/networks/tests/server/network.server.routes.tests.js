'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Network = mongoose.model('Network'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  network;

/**
 * Network routes tests
 */
describe('Network CRUD tests', function () {

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

    // Save a user to the test db and create new Network
    user.save(function () {
      network = {
        name: 'Network name'
      };

      done();
    });
  });

  it('should be able to save a Network if logged in', function (done) {
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

        // Save a new Network
        agent.post('/api/networks')
          .send(network)
          .expect(200)
          .end(function (networkSaveErr, networkSaveRes) {
            // Handle Network save error
            if (networkSaveErr) {
              return done(networkSaveErr);
            }

            // Get a list of Networks
            agent.get('/api/networks')
              .end(function (networksGetErr, networksGetRes) {
                // Handle Networks save error
                if (networksGetErr) {
                  return done(networksGetErr);
                }

                // Get Networks list
                var networks = networksGetRes.body;

                // Set assertions
                (networks[0].user._id).should.equal(userId);
                (networks[0].name).should.match('Network name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Network if not logged in', function (done) {
    agent.post('/api/networks')
      .send(network)
      .expect(403)
      .end(function (networkSaveErr, networkSaveRes) {
        // Call the assertion callback
        done(networkSaveErr);
      });
  });

  it('should not be able to save an Network if no name is provided', function (done) {
    // Invalidate name field
    network.name = '';

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

        // Save a new Network
        agent.post('/api/networks')
          .send(network)
          .expect(400)
          .end(function (networkSaveErr, networkSaveRes) {
            // Set message assertion
            (networkSaveRes.body.message).should.match('Please fill Network name');

            // Handle Network save error
            done(networkSaveErr);
          });
      });
  });

  it('should be able to update an Network if signed in', function (done) {
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

        // Save a new Network
        agent.post('/api/networks')
          .send(network)
          .expect(200)
          .end(function (networkSaveErr, networkSaveRes) {
            // Handle Network save error
            if (networkSaveErr) {
              return done(networkSaveErr);
            }

            // Update Network name
            network.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Network
            agent.put('/api/networks/' + networkSaveRes.body._id)
              .send(network)
              .expect(200)
              .end(function (networkUpdateErr, networkUpdateRes) {
                // Handle Network update error
                if (networkUpdateErr) {
                  return done(networkUpdateErr);
                }

                // Set assertions
                (networkUpdateRes.body._id).should.equal(networkSaveRes.body._id);
                (networkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Networks if not signed in', function (done) {
    // Create new Network model instance
    var networkObj = new Network(network);

    // Save the network
    networkObj.save(function () {
      // Request Networks
      request(app).get('/api/networks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Network if not signed in', function (done) {
    // Create new Network model instance
    var networkObj = new Network(network);

    // Save the Network
    networkObj.save(function () {
      request(app).get('/api/networks/' + networkObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', network.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Network with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/networks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Network is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Network which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Network
    request(app).get('/api/networks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Network with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Network if signed in', function (done) {
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

        // Save a new Network
        agent.post('/api/networks')
          .send(network)
          .expect(200)
          .end(function (networkSaveErr, networkSaveRes) {
            // Handle Network save error
            if (networkSaveErr) {
              return done(networkSaveErr);
            }

            // Delete an existing Network
            agent.delete('/api/networks/' + networkSaveRes.body._id)
              .send(network)
              .expect(200)
              .end(function (networkDeleteErr, networkDeleteRes) {
                // Handle network error error
                if (networkDeleteErr) {
                  return done(networkDeleteErr);
                }

                // Set assertions
                (networkDeleteRes.body._id).should.equal(networkSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Network if not signed in', function (done) {
    // Set Network user
    network.user = user;

    // Create new Network model instance
    var networkObj = new Network(network);

    // Save the Network
    networkObj.save(function () {
      // Try deleting Network
      request(app).delete('/api/networks/' + networkObj._id)
        .expect(403)
        .end(function (networkDeleteErr, networkDeleteRes) {
          // Set message assertion
          (networkDeleteRes.body.message).should.match('User is not authorized');

          // Handle Network error error
          done(networkDeleteErr);
        });

    });
  });

  it('should be able to get a single Network that has an orphaned user reference', function (done) {
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

          // Save a new Network
          agent.post('/api/networks')
            .send(network)
            .expect(200)
            .end(function (networkSaveErr, networkSaveRes) {
              // Handle Network save error
              if (networkSaveErr) {
                return done(networkSaveErr);
              }

              // Set assertions on new Network
              (networkSaveRes.body.name).should.equal(network.name);
              should.exist(networkSaveRes.body.user);
              should.equal(networkSaveRes.body.user._id, orphanId);

              // force the Network to have an orphaned user reference
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

                    // Get the Network
                    agent.get('/api/networks/' + networkSaveRes.body._id)
                      .expect(200)
                      .end(function (networkInfoErr, networkInfoRes) {
                        // Handle Network error
                        if (networkInfoErr) {
                          return done(networkInfoErr);
                        }

                        // Set assertions
                        (networkInfoRes.body._id).should.equal(networkSaveRes.body._id);
                        (networkInfoRes.body.name).should.equal(network.name);
                        should.equal(networkInfoRes.body.user, undefined);

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
      Network.remove().exec(done);
    });
  });
});
