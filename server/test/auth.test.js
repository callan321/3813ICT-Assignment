const request = require('supertest');
const { server } = require('../server');
const assert = require('assert');

describe('Auth API', () => {
  let createdUserId;

  // Test to create a new user for login testing
  it('should create a new user', (done) => {
    const newUser = {
      username: 'authTestUser',
      email: 'authTestUser@example.com',
      password: 'password123',
      roles: ['user'],
    };

    request(server)
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.user.username === 'authTestUser', 'Username should match');
        createdUserId = res.body.user._id;
        done();
      });
  });

  // Test successful login
  it('should login successfully with valid credentials', (done) => {
    const credentials = {
      username: 'authTestUser',
      password: 'password123'
    };

    request(server)
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.message === 'Login successful', 'Login should be successful');
        assert(res.body.user.username === 'authTestUser', 'Username should match');
        done();
      });
  });

  // Test failed login due to wrong password
  it('should fail login with incorrect password', (done) => {
    const credentials = {
      username: 'authTestUser',
      password: 'wrongpassword'
    };

    request(server)
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.message === 'Invalid username or password', 'Login should fail with incorrect password');
        done();
      });
  });

  // Clean up by deleting the created user
  it('should DELETE the created user (clean up)', (done) => {
    request(server)
      .delete(`/api/users/${createdUserId}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
