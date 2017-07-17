'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Panel = mongoose.model('Panel'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  panel;

/**
 * Panel routes tests
 */
describe('Panel CRUD tests', function () {

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

    // Save a user to the test db and create new Panel
    user.save(function () {
      panel = {
        name: 'Panel name'
      };

      done();
    });
  });

  it('should be able to save a Panel if logged in', function (done) {
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

        // Save a new Panel
        agent.post('/api/panels')
          .send(panel)
          .expect(200)
          .end(function (panelSaveErr, panelSaveRes) {
            // Handle Panel save error
            if (panelSaveErr) {
              return done(panelSaveErr);
            }

            // Get a list of Panels
            agent.get('/api/panels')
              .end(function (panelsGetErr, panelsGetRes) {
                // Handle Panels save error
                if (panelsGetErr) {
                  return done(panelsGetErr);
                }

                // Get Panels list
                var panels = panelsGetRes.body;

                // Set assertions
                (panels[0].user._id).should.equal(userId);
                (panels[0].name).should.match('Panel name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Panel if not logged in', function (done) {
    agent.post('/api/panels')
      .send(panel)
      .expect(403)
      .end(function (panelSaveErr, panelSaveRes) {
        // Call the assertion callback
        done(panelSaveErr);
      });
  });

  it('should not be able to save an Panel if no name is provided', function (done) {
    // Invalidate name field
    panel.name = '';

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

        // Save a new Panel
        agent.post('/api/panels')
          .send(panel)
          .expect(400)
          .end(function (panelSaveErr, panelSaveRes) {
            // Set message assertion
            (panelSaveRes.body.message).should.match('Please fill Panel name');

            // Handle Panel save error
            done(panelSaveErr);
          });
      });
  });

  it('should be able to update an Panel if signed in', function (done) {
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

        // Save a new Panel
        agent.post('/api/panels')
          .send(panel)
          .expect(200)
          .end(function (panelSaveErr, panelSaveRes) {
            // Handle Panel save error
            if (panelSaveErr) {
              return done(panelSaveErr);
            }

            // Update Panel name
            panel.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Panel
            agent.put('/api/panels/' + panelSaveRes.body._id)
              .send(panel)
              .expect(200)
              .end(function (panelUpdateErr, panelUpdateRes) {
                // Handle Panel update error
                if (panelUpdateErr) {
                  return done(panelUpdateErr);
                }

                // Set assertions
                (panelUpdateRes.body._id).should.equal(panelSaveRes.body._id);
                (panelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Panels if not signed in', function (done) {
    // Create new Panel model instance
    var panelObj = new Panel(panel);

    // Save the panel
    panelObj.save(function () {
      // Request Panels
      request(app).get('/api/panels')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Panel if not signed in', function (done) {
    // Create new Panel model instance
    var panelObj = new Panel(panel);

    // Save the Panel
    panelObj.save(function () {
      request(app).get('/api/panels/' + panelObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', panel.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Panel with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/panels/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Panel is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Panel which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Panel
    request(app).get('/api/panels/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Panel with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Panel if signed in', function (done) {
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

        // Save a new Panel
        agent.post('/api/panels')
          .send(panel)
          .expect(200)
          .end(function (panelSaveErr, panelSaveRes) {
            // Handle Panel save error
            if (panelSaveErr) {
              return done(panelSaveErr);
            }

            // Delete an existing Panel
            agent.delete('/api/panels/' + panelSaveRes.body._id)
              .send(panel)
              .expect(200)
              .end(function (panelDeleteErr, panelDeleteRes) {
                // Handle panel error error
                if (panelDeleteErr) {
                  return done(panelDeleteErr);
                }

                // Set assertions
                (panelDeleteRes.body._id).should.equal(panelSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Panel if not signed in', function (done) {
    // Set Panel user
    panel.user = user;

    // Create new Panel model instance
    var panelObj = new Panel(panel);

    // Save the Panel
    panelObj.save(function () {
      // Try deleting Panel
      request(app).delete('/api/panels/' + panelObj._id)
        .expect(403)
        .end(function (panelDeleteErr, panelDeleteRes) {
          // Set message assertion
          (panelDeleteRes.body.message).should.match('User is not authorized');

          // Handle Panel error error
          done(panelDeleteErr);
        });

    });
  });

  it('should be able to get a single Panel that has an orphaned user reference', function (done) {
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

          // Save a new Panel
          agent.post('/api/panels')
            .send(panel)
            .expect(200)
            .end(function (panelSaveErr, panelSaveRes) {
              // Handle Panel save error
              if (panelSaveErr) {
                return done(panelSaveErr);
              }

              // Set assertions on new Panel
              (panelSaveRes.body.name).should.equal(panel.name);
              should.exist(panelSaveRes.body.user);
              should.equal(panelSaveRes.body.user._id, orphanId);

              // force the Panel to have an orphaned user reference
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

                    // Get the Panel
                    agent.get('/api/panels/' + panelSaveRes.body._id)
                      .expect(200)
                      .end(function (panelInfoErr, panelInfoRes) {
                        // Handle Panel error
                        if (panelInfoErr) {
                          return done(panelInfoErr);
                        }

                        // Set assertions
                        (panelInfoRes.body._id).should.equal(panelSaveRes.body._id);
                        (panelInfoRes.body.name).should.equal(panel.name);
                        should.equal(panelInfoRes.body.user, undefined);

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
      Panel.remove().exec(done);
    });
  });
});
