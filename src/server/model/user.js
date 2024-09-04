// User model
class User {
  constructor(id, username, email, password, roles = ['user'], groups = []) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.groups = groups;
  }
}

// Group model
class Group {
  constructor(groupId, groupName, createdBy, admins = [], members = [], channels = []) {
    this.groupId = groupId;
    this.groupName = groupName;
    this.createdBy = createdBy;
    this.admins = admins;
    this.members = members;
    this.channels = channels;
  }

  addMember(userId) {
    if (!this.members.includes(userId)) {
      this.members.push(userId);
    }
  }

  addAdmin(userId) {
    if (!this.admins.includes(userId)) {
      this.admins.push(userId);
    }
  }

  addChannel(channel) {
    this.channels.push(channel);
  }
}

// Channel model
class Channel {
  constructor(channelId, channelName, createdBy, messages = []) {
    this.channelId = channelId;
    this.channelName = channelName;
    this.createdBy = createdBy;
    this.messages = messages;
  }

  addMessage(message) {
    this.messages.push(message);
  }
}

// Message model
class Message {
  constructor(messageId, senderId, content) {
    this.messageId = messageId;
    this.senderId = senderId;
    this.content = content;
  }
}

// Initial users
let users = [
  new User(1, 'super', 'super@example.com', '123', ['Super Admin']),
  new User(2, 'user', 'regular@example.com', 'password', ['User']),
];

// Initial groups, channels, and messages
let groups = [
  new Group(1, 'General Group', 1, [1], [1, 2], [
    new Channel(1, 'General Chat', 1, [
      new Message(1, 1, 'Hello, this is a message from the super admin!'),
      new Message(2, 2, 'Hi, this is a message from a regular user!')
    ])
  ]),
  new Group(2, 'Development Group', 2, [2], [2], [
    new Channel(2, 'Dev Discussions', 2, [
      new Message(3, 2, 'Let’s start discussing the new project here.')
    ])
  ])
];

module.exports = {
  User,
  Group,
  Channel,
  Message,
  users,
  groups
};
