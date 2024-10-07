const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'ChatApp';

const { User, Group, Channel, Message } = require('./models'); // Import models

// Function to handle database connection
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
    req.body.id,
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
    res.json({ message: 'User created', user: result.ops[0] });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', err });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const result = await usersCollection.updateOne({ id: userId }, { $set: updatedUser });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user: updatedUser });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', err });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const result = await usersCollection.deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
    await client.close();
  } catch (err) {
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
    req.body.groupId,
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
    res.json({ message: 'Group created', group: result.ops[0] });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error creating group', err });
  }
};

// Update a group
const updateGroup = async (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const updatedGroup = req.body;

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.updateOne({ groupId: groupId }, { $set: updatedGroup });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Group updated', group: updatedGroup });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error updating group', err });
  }
};

// Delete a group
const deleteGroup = async (req, res) => {
  const groupId = parseInt(req.params.groupId);

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const result = await groupsCollection.deleteOne({ groupId: groupId });

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
  const groupId = parseInt(req.params.groupId);
  const userId = parseInt(req.params.userId);

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    const result = await groupsCollection.updateOne(
      { groupId: groupId },
      { $pull: { members: userId } }
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

// Remove an admin from the group
const removeAdminFromGroup = async (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const adminId = parseInt(req.params.adminId);

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    const result = await groupsCollection.updateOne(
      { groupId: groupId },
      { $pull: { admins: adminId } }
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
  const groupId = parseInt(req.params.groupId);
  const channelId = parseInt(req.params.channelId);

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    const result = await groupsCollection.updateOne(
      { groupId: groupId },
      { $pull: { channels: { channelId: channelId } } }
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
  const groupId = parseInt(req.params.groupId);
  const userId = parseInt(req.params.userId);

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    const result = await groupsCollection.updateOne(
      { groupId: groupId },
      { $pull: { members: userId }, $addToSet: { admins: userId } } // Remove from members, add to admins
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
  const groupId = parseInt(req.params.groupId);
  const { channelName, createdBy } = req.body;

  const newChannel = {
    channelId: new Date().getTime(), // Unique channelId based on timestamp
    channelName,
    createdBy,
    messages: []
  };

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    const result = await groupsCollection.updateOne(
      { groupId: groupId },
      { $push: { channels: newChannel } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Channel added successfully', channel: newChannel });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error adding channel to group', err });
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
  addChannelToGroup
};
