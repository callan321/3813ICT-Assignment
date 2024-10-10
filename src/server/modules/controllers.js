const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'ChatApp';

// Import models
const { User, Group, Channel, Message } = require('./models');

// Database connection helper function
const connectToDatabase = async () => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  return { db, client };
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    res.json(users);
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', err });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const newUser = new User(
    req.body.username,
    req.body.email,
    req.body.password,
    req.body.roles,
    req.body.groups
  );

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User created', user: { _id: result.insertedId, ...newUser } });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', err });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const userId = req.params.id;

  // Ensure the ID is a valid ObjectId
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Attempt to update the user with the provided ID
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: req.body }
    );

    // Handle the case where no document matched the provided ID
    if (result.matchedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated', user: req.body });
    await client.close();
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user', err });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Ensure the ID is a valid ObjectId
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Attempt to delete the user with the provided ID
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    // Handle the case where no document matched the provided ID
    if (result.deletedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
    await client.close();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', err });
  }
};

// Get all groups
const getAllGroups = async (req, res) => {
  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const groups = await groupsCollection.find({}).toArray();
    res.json(groups);
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error fetching groups', err });
  }
};

// Create a new group
const createGroup = async (req, res) => {
  const newGroup = new Group(
    req.body.groupName,
    req.body.createdBy,
    req.body.admins,
    req.body.members,
    req.body.channels
  );

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.insertOne(newGroup);
    res.status(201).json({ message: 'Group created', group: { _id: result.insertedId, ...newGroup } });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error creating group', err });
  }
};

// Update a group
const updateGroup = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Group updated', group: req.body });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error updating group', err });
  }
};

// Delete a group
const deleteGroup = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.deleteOne({ _id: new ObjectId(groupId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Group deleted' });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting group', err });
  }
};

// Remove a user from a group
const removeUserFromGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $pull: { members: new ObjectId(userId) } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'User removed from group members' });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error removing user from group', err });
  }
};

// Remove an admin from a group
const removeAdminFromGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const adminId = req.params.adminId;

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $pull: { admins: new ObjectId(adminId) } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Admin removed from group' });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error removing admin from group', err });
  }
};

// Remove a channel from a group
const removeChannelFromGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const channelId = req.params.channelId;

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $pull: { channels: { channelId: new ObjectId(channelId) } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Channel removed from group' });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error removing channel from group', err });
  }
};

// Upgrade a user to admin
const upgradeToAdmin = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $pull: { members: new ObjectId(userId) }, $addToSet: { admins: new ObjectId(userId) } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'User upgraded to admin' });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error upgrading user to admin', err });
  }
};

// Add a new channel to a group
const addChannelToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { channelName, createdBy } = req.body;

  if (!ObjectId.isValid(groupId) || !ObjectId.isValid(createdBy)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    const newChannel = {
      _id: new ObjectId(),
      channelName,
      createdBy: new ObjectId(createdBy),
      messages: [],
    };

    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $push: { channels: newChannel } }
    );

    if (result.matchedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(201).json({ message: 'Channel added to group', channel: newChannel });
    await client.close();
  } catch (err) {
    console.error('Error adding channel:', err);
    res.status(500).json({ message: 'Error adding channel', error: err.message });
  }
};


// Get group and channel information
const getGroupChannelInfo = async (req, res) => {
  const groupId = req.params.groupId;
  const channelId = req.params.channelId;

  try {
    // Establish MongoDB connection
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    // Find the group by groupId
    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

    if (!group) {
      await client.close();
      return res.status(404).json({ message: 'Group not found' });
    }

    // Find the specific channel within the group
    const channel = group.channels.find((c) => c._id.toString() === channelId);  // Potential source of error

    if (!channel) {
      await client.close();
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Close the MongoDB connection once we are done
    await client.close();

    // Return group and channel details
    return res.json({
      groupName: group.groupName,
      channelName: channel.channelName,
      messages: channel.messages
    });
  } catch (err) {
    // Handle any error that occurs and send a 500 error response
    console.error('Error fetching group or channel info:', err);
    res.status(500).json({ message: 'Error fetching group or channel info', error: err.message });
  }
};


// Post a new message to a channel and broadcast it
// Post a new message to a channel and broadcast it
const postMessageToChannel = async (req, res, io) => {
  const groupId = req.params.groupId;
  const channelId = req.params.channelId;
  const { senderId, content } = req.body;

  if (!content || !senderId) {
    return res.status(400).json({ message: 'Sender ID and content are required.' });
  }

  const newMessage = {
    messageId: new Date().getTime(),
    senderId,
    content,
  };

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    // Update the specific group and channel by pushing the new message into the channel's messages array
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId), 'channels._id': new ObjectId(channelId) },
      { $push: { 'channels.$.messages': newMessage } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group or channel not found' });
    }

    // Emit the message to the specific channel room
    io.to(channelId).emit('messageBroadcast', newMessage);

    res.status(201).json({ message: 'Message posted successfully', messageData: newMessage });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error posting message', err });
  }
};



const getGroupsAndChannelsForUser = async (req, res) => {
  const userId = req.params.userId;  // The user ID will be passed as a parameter

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    // Find groups where the user is a member or an admin
    const groups = await groupsCollection.find({
      $or: [
        { members: new ObjectId(userId) },
        { admins: new ObjectId(userId) }
      ]
    }).toArray();

    // For each group, map over its channels and set channelId from MongoDB's _id
    const groupsWithChannelIds = groups.map(group => ({
      ...group,
      channels: group.channels.map(channel => ({
        ...channel,
        channelId: channel._id
      }))
    }));

    // Return the modified groups with channelId
    res.json(groupsWithChannelIds);
    await client.close();
  } catch (err) {
    console.error('Error fetching groups and channels:', err);
    res.status(500).json({ message: 'Error fetching groups and channels', error: err.message });
  }
};


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  removeUserFromGroup,
  removeAdminFromGroup,
  removeChannelFromGroup,
  upgradeToAdmin,
  addChannelToGroup,
  getGroupChannelInfo,
  postMessageToChannel,
  getGroupsAndChannelsForUser
};
