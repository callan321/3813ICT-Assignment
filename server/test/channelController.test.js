const request = require('supertest');
const { server } = require('../server');
const assert = require('assert');

describe('Channel API', () => {
  let createdUserId;
  let createdGroupId;
  let createdChannelId;

  // Creates a new user for the channel operations
  it('should create a new user', (done) => {
    const newUser = {
      username: 'testUserForChannel',
      email: 'testUserForChannel@example.com',
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
        assert(res.body.user.username === 'testUserForChannel', 'Username should be testUserForChannel');
        createdUserId = res.body.user._id;
        done();
      });
  });

  // Creates a new group for the user
  it('should create a new group', (done) => {
    const newGroup = {
      groupName: 'Test Group for Channel',
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
        assert(res.body.group.groupName === 'Test Group for Channel', 'Group name should be Test Group for Channel');
        createdGroupId = res.body.group._id;
        done();
      });
  });

  // Adds a new channel to the group
  it('should add a new channel to the group', (done) => {
    const newChannel = {
      channelName: 'Test Channel',
      createdBy: createdUserId
    };

    request(server)
      .post(`/api/groups/${createdGroupId}/add-channel`)
      .send(newChannel)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.channelId, 'Response should contain a channel ID');
        createdChannelId = res.body.channelId;
        done();
      });
  });

  // Fetches the created channel by its ID
  it('should GET the created channel by ID', (done) => {
    request(server)
      .get(`/api/channel/${createdChannelId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body._id.toString() === createdChannelId.toString(), 'Channel ID should match the requested ID');
        assert(res.body.channelName === 'Test Channel', 'Channel name should be Test Channel');
        done();
      });
  });

  // Fetches only the name of the created channel
  it('should GET the name of the created channel by ID', (done) => {
    request(server)
      .get(`/api/channel/name/${createdChannelId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.name === 'Test Channel', 'Channel name should match Test Channel');
        done();
      });
  });

  // Sends a message to the created channel
  it('should POST a new message to the channel', (done) => {
    const newMessage = {
      senderId: createdUserId,
      content: 'This is a test message'
    };

    request(server)
      .post(`/api/channel/${createdChannelId}/message`)
      .send(newMessage)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.messageData.content === newMessage.content, 'Message content should match');
        assert(res.body.messageData.senderId === newMessage.senderId, 'Sender ID should match');
        done();
      });
  });

  // Uploads an image to the channel
  it('should POST an image to the channel', (done) => {
    request(server)
      .post(`/api/channel/${createdChannelId}/upload-image`)
      .attach('file', `${__dirname}/images/dog.png`)
      .field('senderId', createdUserId)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.newMessage.type === 'img', 'Message type should be img');
        assert(res.body.newMessage.content, 'Image content should be present');
        done();
      });
  });

  // Deletes the created user and group to clean up
  it('should DELETE the created user and group (clean up)', (done) => {
    request(server)
      .delete(`/api/users/${createdUserId}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        request(server)
          .delete(`/api/groups/${createdGroupId}`)
          .expect(200)
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });
  });
});
