// test/main.test.js

const assert = require('assert');
const http = require('http');

let existingUserId;
let existingGroupId;
let existingChannelId;

// Helper function to make HTTP requests
const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({ data: JSON.parse(data), statusCode: res.statusCode });
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

describe('API Tests', function () {
  // Fetch existing IDs before tests
  before(async function () {
    // Fetch a user ID
    const userOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'GET',
    };

    const userResponse = await makeRequest(userOptions);
    if (userResponse.statusCode === 200 && userResponse.data.length > 0) {
      existingUserId = userResponse.data[0]._id;
    } else {
      throw new Error('No users found.');
    }

    // Fetch a group ID
    const groupOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/groups',
      method: 'GET',
    };

    const groupResponse = await makeRequest(groupOptions);
    if (groupResponse.statusCode === 200 && groupResponse.data.length > 0) {
      existingGroupId = groupResponse.data[0]._id;
      // Fetch a channel ID from the group
      if (groupResponse.data[0].channels && groupResponse.data[0].channels.length > 0) {
        existingChannelId = groupResponse.data[0].channels[0]._id;
      } else {
        throw new Error('No channels found in the group.');
      }
    } else {
      throw new Error('No groups found.');
    }
  });

  // Test GET /api/users
  it('should return all users', async function () {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'GET',
    };

    const response = await makeRequest(options);
    assert.strictEqual(response.statusCode, 200);
    assert.ok(Array.isArray(response.data));
  });

  // Test POST /api/users
  it('should create a new user', async function () {
    const postData = JSON.stringify({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.data.user.username, 'newuser');
  });

  // Test PUT /api/users/:id
  it('should update an existing user', async function () {
    const postData = JSON.stringify({
      email: 'updateduser@example.com',
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/users/${existingUserId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.data.user.email, 'updateduser@example.com');
  });

  // Test DELETE /api/users/:id
  it('should delete an existing user', async function () {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/users/${existingUserId}`,
      method: 'DELETE',
    };

    const response = await makeRequest(options);
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.data.message, 'User deleted');
  });

  // Test GET /api/groups
  it('should return all groups', async function () {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/groups',
      method: 'GET',
    };

    const response = await makeRequest(options);
    assert.strictEqual(response.statusCode, 200);
    assert.ok(Array.isArray(response.data));
  });

  // Test POST /api/groups
  it('should create a new group', async function () {
    const postData = JSON.stringify({
      groupName: 'New Group',
      createdBy: existingUserId,
      admins: [existingUserId],
      members: [existingUserId],
      channels: [],
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/groups',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.data.group.groupName, 'New Group');
  });

  // Test POST /api/groups/:groupId/add-channel
  it('should add a channel to a group', async function () {
    const postData = JSON.stringify({
      channelName: 'New Channel',
      createdBy: existingUserId,
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/groups/${existingGroupId}/add-channel`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.data.channel.channelName, 'New Channel');
    existingChannelId = response.data.channel._id;
  });

  // Test POST /api/group/:groupId/channel/:channelId/message
  it('should post a message to a channel', async function () {
    const postData = JSON.stringify({
      senderId: existingUserId,
      content: 'Hello, World!',
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/group/${existingGroupId}/channel/${existingChannelId}/message`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.data.messageData.content, 'Hello, World!');
  });
});
