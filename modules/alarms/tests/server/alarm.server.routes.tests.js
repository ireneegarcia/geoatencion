'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Alarm = mongoose.model('Alarm'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  alarm;

/**
 * Alarm routes tests
 */
describe('Alarm CRUD tests', function () {

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

    // Save a user to the test db and create new Alarm
    user.save(function () {
      alarm = {
        name: 'Alarm name'
      };

      done();
    });
  });

  it('should be able to save a Alarm if logged in', function (done) {
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

        // Save a new Alarm
        agent.post('/api/alarms')
          .send(alarm)
          .expect(200)
          .end(function (alarmSaveErr, alarmSaveRes) {
            // Handle Alarm save error
            if (alarmSaveErr) {
              return done(alarmSaveErr);
            }

            // Get a list of Alarms
            agent.get('/api/alarms')
              .end(function (alarmsGetErr, alarmsGetRes) {
                // Handle Alarms save error
                if (alarmsGetErr) {
                  return done(alarmsGetErr);
                }

                // Get Alarms list
                var alarms = alarmsGetRes.body;

                // Set assertions
                (alarms[0].user._id).should.equal(userId);
                (alarms[0].name).should.match('Alarm name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Alarm if not logged in', function (done) {
    agent.post('/api/alarms')
      .send(alarm)
      .expect(403)
      .end(function (alarmSaveErr, alarmSaveRes) {
        // Call the assertion callback
        done(alarmSaveErr);
      });
  });

  it('should not be able to save an Alarm if no name is provided', function (done) {
    // Invalidate name field
    alarm.name = '';

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

        // Save a new Alarm
        agent.post('/api/alarms')
          .send(alarm)
          .expect(400)
          .end(function (alarmSaveErr, alarmSaveRes) {
            // Set message assertion
            (alarmSaveRes.body.message).should.match('Please fill Alarm name');

            // Handle Alarm save error
            done(alarmSaveErr);
          });
      });
  });

  it('should be able to update an Alarm if signed in', function (done) {
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

        // Save a new Alarm
        agent.post('/api/alarms')
          .send(alarm)
          .expect(200)
          .end(function (alarmSaveErr, alarmSaveRes) {
            // Handle Alarm save error
            if (alarmSaveErr) {
              return done(alarmSaveErr);
            }

            // Update Alarm name
            alarm.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Alarm
            agent.put('/api/alarms/' + alarmSaveRes.body._id)
              .send(alarm)
              .expect(200)
              .end(function (alarmUpdateErr, alarmUpdateRes) {
                // Handle Alarm update error
                if (alarmUpdateErr) {
                  return done(alarmUpdateErr);
                }

                // Set assertions
                (alarmUpdateRes.body._id).should.equal(alarmSaveRes.body._id);
                (alarmUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Alarms if not signed in', function (done) {
    // Create new Alarm model instance
    var alarmObj = new Alarm(alarm);

    // Save the alarm
    alarmObj.save(function () {
      // Request Alarms
      request(app).get('/api/alarms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Alarm if not signed in', function (done) {
    // Create new Alarm model instance
    var alarmObj = new Alarm(alarm);

    // Save the Alarm
    alarmObj.save(function () {
      request(app).get('/api/alarms/' + alarmObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', alarm.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Alarm with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/alarms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Alarm is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Alarm which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Alarm
    request(app).get('/api/alarms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Alarm with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Alarm if signed in', function (done) {
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

        // Save a new Alarm
        agent.post('/api/alarms')
          .send(alarm)
          .expect(200)
          .end(function (alarmSaveErr, alarmSaveRes) {
            // Handle Alarm save error
            if (alarmSaveErr) {
              return done(alarmSaveErr);
            }

            // Delete an existing Alarm
            agent.delete('/api/alarms/' + alarmSaveRes.body._id)
              .send(alarm)
              .expect(200)
              .end(function (alarmDeleteErr, alarmDeleteRes) {
                // Handle alarm error error
                if (alarmDeleteErr) {
                  return done(alarmDeleteErr);
                }

                // Set assertions
                (alarmDeleteRes.body._id).should.equal(alarmSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Alarm if not signed in', function (done) {
    // Set Alarm user
    alarm.user = user;

    // Create new Alarm model instance
    var alarmObj = new Alarm(alarm);

    // Save the Alarm
    alarmObj.save(function () {
      // Try deleting Alarm
      request(app).delete('/api/alarms/' + alarmObj._id)
        .expect(403)
        .end(function (alarmDeleteErr, alarmDeleteRes) {
          // Set message assertion
          (alarmDeleteRes.body.message).should.match('User is not authorized');

          // Handle Alarm error error
          done(alarmDeleteErr);
        });

    });
  });

  it('should be able to get a single Alarm that has an orphaned user reference', function (done) {
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

          // Save a new Alarm
          agent.post('/api/alarms')
            .send(alarm)
            .expect(200)
            .end(function (alarmSaveErr, alarmSaveRes) {
              // Handle Alarm save error
              if (alarmSaveErr) {
                return done(alarmSaveErr);
              }

              // Set assertions on new Alarm
              (alarmSaveRes.body.name).should.equal(alarm.name);
              should.exist(alarmSaveRes.body.user);
              should.equal(alarmSaveRes.body.user._id, orphanId);

              // force the Alarm to have an orphaned user reference
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

                    // Get the Alarm
                    agent.get('/api/alarms/' + alarmSaveRes.body._id)
                      .expect(200)
                      .end(function (alarmInfoErr, alarmInfoRes) {
                        // Handle Alarm error
                        if (alarmInfoErr) {
                          return done(alarmInfoErr);
                        }

                        // Set assertions
                        (alarmInfoRes.body._id).should.equal(alarmSaveRes.body._id);
                        (alarmInfoRes.body.name).should.equal(alarm.name);
                        should.equal(alarmInfoRes.body.user, undefined);

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
      Alarm.remove().exec(done);
    });
  });
});
