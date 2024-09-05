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
  constructor(channelId, channelName, createdBy, groupId, messages = []) {
    this.channelId = channelId;
    this.groupId = groupId;
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

let users = [
  new User(1, 'super', 'super@example.com', '123', ['Super Admin'], [1, 2]),
  new User(2, 'user', 'regular@example.com', 'password', ['User'], [1]),
  new User(3, 'developer', 'dev@example.com', 'devpass', ['User'], [2, 4]),
  new User(4, 'designer', 'designer@example.com', 'designpass', ['User'], [3])
];

let groups = [
  new Group(1, 'General Group', 1, [1], [1, 2], [
    new Channel(1, 'General Chat', 1, 1, [
      new Message(1, 1, 'Hello, this is a message from the super admin!'),
      new Message(2, 2, 'Hi, this is a message from a regular user!')
    ]),
    new Channel(1, 'Empty Chat', 1, 1, [])
  ]),
  new Group(2, 'Development Group', 2, [2], [1, 3], [
    new Channel(2, 'Dev Discussions', 2, 2, [
      new Message(3, 2, 'Let’s start discussing the new project here.')
    ])
  ]),
  new Group(3, 'Design Team', 4, [4], [4], [
    new Channel(3, 'Design Chat', 4, 3, [
      new Message(4, 4, 'Let’s brainstorm ideas for the new project.'),
      new Message(5, 3, 'I have some mockups ready for review.')
    ])
  ]),
  new Group(4, 'Marketing Team', 3, [3], [3], [
    new Channel(4, 'Marketing Chat', 3, 4, [
      new Message(6, 3, 'Welcome to the Marketing Team!')
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
