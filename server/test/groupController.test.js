const request = require('supertest');
const { server } = require('../server');
const assert = require('assert');

describe('Group API', () => {
  let createdGroupId;
  let createdUserId;

  // Test POST create a new user (to be used for group creation)
  it('should POST a new user', (done) => {
    const newUser = {
      username: 'groupTestUser',
      email: 'grouptestuser@example.com',
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
        assert(res.body.user.username === 'groupTestUser', 'Username should be groupTestUser');
        createdUserId = res.body.user._id; // Capture the created user ID for group tests
        done();
      });
  });

  // Test GET all groups
  it('should GET all groups', (done) => {
    request(server)
      .get('/api/groups')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(Array.isArray(res.body), 'Response should be an array');
        done();
      });
  });

  // Test POST create a new group using the created user ID
  it('should POST a new group', (done) => {
    const newGroup = {
      groupName: 'Test Group',
      createdBy: createdUserId,
      admins: [createdUserId],
      members: [createdUserId],
      channels: []
    };

    request(server)
      .post('/api/groups')
      .send(newGroup)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.group.groupName === 'Test Group', 'Group name should be Test Group');
        createdGroupId = res.body.group._id; // Capture the created group ID for further tests
        done();
      });
  });

  // Test GET single group by ID
  it('should GET a single group by ID', (done) => {
    request(server)
      .get(`/api/groups/${createdGroupId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body._id.toString() === createdGroupId.toString(), 'Group ID should match the requested ID');
        done();
      });
  });

  // Test PUT update the created group
  it('should UPDATE the created group', (done) => {
    const updatedData = {
      groupName: 'Updated Test Group',
    };

    request(server)
      .put(`/api/groups/${createdGroupId}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.group.groupName === 'Updated Test Group', 'Group name should be updated');
        done();
      });
  });

  // Test DELETE the created group
  it('should DELETE the created group', (done) => {
    request(server)
      .delete(`/api/groups/${createdGroupId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.message === 'Group deleted', 'Group should be deleted');
        done();
      });
  });

  // Test DELETE the created user (clean up)
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
