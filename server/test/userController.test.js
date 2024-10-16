const request = require('supertest');
const { server } = require('../server');
const assert = require('assert');

describe('User API', () => {
  let createdUserId;

  // Test GET all users
  it('should GET all users', (done) => {
    request(server)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(Array.isArray(res.body), 'Response should be an array');
        done();
      });
  });

  // Test POST create new user
  it('should POST a new user', (done) => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      roles: ['user'],
      groups: []
    };

    request(server)
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.user.username === 'testuser', 'Username should be testuser');
        createdUserId = res.body.user._id;
        done();
      });
  });

  // Test GET single user by ID
  it('should GET a single user by ID', (done) => {
    request(server)
      .get(`/api/users/${createdUserId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body._id === createdUserId, 'User ID should match the requested ID');
        done();
      });
  });

  // Test PUT update user
  it('should UPDATE the created user', (done) => {
    const updatedData = {
      email: 'updatedemail@example.com',
    };

    request(server)
      .put(`/api/users/${createdUserId}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.user.email === 'updatedemail@example.com', 'Email should be updated');
        done();
      });
  });

  // Test DELETE the created user
  it('should DELETE the created user', (done) => {
    request(server)
      .delete(`/api/users/${createdUserId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.message === 'User deleted', 'User should be deleted');
        done();
      });
  });
});
