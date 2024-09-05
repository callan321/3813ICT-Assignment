const { users, groups } = require('./models');

// Get all users
const getAllUsers = (req, res) => {
  res.json(users);
};

// Create a new user
const createUser = (req, res) => {
  const newUser = req.body;
  newUser.id = users.length + 1; // Simple ID assignment
  users.push(newUser);
  res.json({ message: 'User created', user: newUser });
};

// Update a user
const updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.json({ message: 'User updated', user: users[userIndex] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Delete a user
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Get all groups
const getAllGroups = (req, res) => {
  res.json(groups);
};

// Create a new group
const createGroup = (req, res) => {
  const newGroup = req.body;
  newGroup.groupId = groups.length + 1; // Simple ID assignment
  groups.push(newGroup);
  res.json({ message: 'Group created', group: newGroup });
};

// Update a group
const updateGroup = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const updatedGroup = req.body;
  const groupIndex = groups.findIndex(group => group.groupId === groupId);

  if (groupIndex !== -1) {
    groups[groupIndex] = { ...groups[groupIndex], ...updatedGroup };
    res.json({ message: 'Group updated', group: groups[groupIndex] });
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
};

// Delete a group
const deleteGroup = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const groupIndex = groups.findIndex(group => group.groupId === groupId);

  if (groupIndex !== -1) {
    groups.splice(groupIndex, 1);
    res.json({ message: 'Group deleted' });
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
};

const removeUserFromGroup = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const userId = parseInt(req.params.userId);
  const group = groups.find(group => group.groupId === groupId);

  if (group) {
    group.members = group.members.filter(member => member !== userId);
    res.json({ message: 'User removed from group members', group });
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
};

// Remove an admin from the group
const removeAdminFromGroup = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const adminId = parseInt(req.params.adminId);
  const group = groups.find(group => group.groupId === groupId);

  if (group) {
    group.admins = group.admins.filter(admin => admin !== adminId);
    res.json({ message: 'Admin removed from group', group });
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
};

// Remove a channel from the group
const removeChannelFromGroup = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const channelId = parseInt(req.params.channelId);
  const group = groups.find(group => group.groupId === groupId);

  if (group) {
    // Filter out only the channel that matches the provided channelId
    group.channels = group.channels.filter(channel => channel.channelId !== channelId);
    res.json({ message: 'Channel removed from group', group });
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
};

const upgradeToAdmin = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const userId = parseInt(req.params.userId);
  const group = groups.find(group => group.groupId === groupId);

  if (group) {
    // Check if the user is a member
    if (group.members.includes(userId)) {
      // Remove the user from members and add to admins
      group.members = group.members.filter(member => member !== userId);
      if (!group.admins.includes(userId)) {
        group.admins.push(userId);
      }
      res.json({ message: 'User upgraded to admin', group });
    } else {
      res.status(404).json({ message: 'User is not a member of this group' });
    }
  } else {
    res.status(404).json({ message: 'Group not found' });
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
};
