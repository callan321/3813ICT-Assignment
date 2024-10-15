
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');
const { Group } = require('./models');

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

  // Check if IDs are valid
  if (!ObjectId.isValid(groupId) || !ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    // Perform the update to remove the channel (directly as an ObjectId in the array)
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $pull: { channels: new ObjectId(channelId) } }  // <-- Corrected the $pull query
    );

    if (result.modifiedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'Channel not found in group' });
    }

    res.json({ message: 'Channel removed from group' });
    await client.close();
  } catch (err) {
    console.error('Error removing channel from group:', err);
    res.status(500).json({ message: 'Error removing channel from group', error: err.message });
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
    const channelsCollection = db.collection('channels');

    // Create new channel document
    const newChannel = {
      _id: new ObjectId(),
      channelName,
      createdBy: new ObjectId(createdBy),
      groupId: new ObjectId(groupId),
      messages: [],
    };

    // Insert the new channel into the 'channels' collection
    await channelsCollection.insertOne(newChannel);

    // Add the channel's _id to the group's 'channels' array
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $push: { channels: newChannel._id } }
    );

    if (result.matchedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(201).json({ message: 'Channel added to group', channelId: newChannel._id });
    await client.close();
  } catch (err) {
    console.error('Error adding channel:', err);
    res.status(500).json({ message: 'Error adding channel', error: err.message });
  }
};

// Get groups and channels for a user
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

    // For each group, map over its channels and convert the channel IDs to strings
    const groupsWithChannelIds = groups.map(group => ({
      ...group,
      channels: group.channels.map(channel => channel.toString())  // Convert channel ID to string
    }));

    // Return the modified groups with channel IDs as strings
    res.json(groupsWithChannelIds);
    await client.close();
  } catch (err) {
    console.error('Error fetching groups and channels:', err);
    res.status(500).json({ message: 'Error fetching groups and channels', error: err.message });
  }
};

const addUserToGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;

  // Validate the groupId and userId
  if (!ObjectId.isValid(groupId) || !ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid group ID or user ID format.' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    // Add the userId to the group's members array
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { $addToSet: { members: new ObjectId(userId) } }  // $addToSet ensures no duplicates
    );

    // Check if the group was found and updated
    if (result.matchedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'User added to group successfully' });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error adding user to group', error: err.message });
  }
};



module.exports = {
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  removeUserFromGroup,
  removeAdminFromGroup,
  removeChannelFromGroup,
  upgradeToAdmin,
  addChannelToGroup,
  getGroupsAndChannelsForUser,
  addUserToGroup,
};
