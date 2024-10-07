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

class Channel {
  constructor(channelId, channelName, createdBy, groupId, messages = []) {
    this.channelId = channelId;
    this.channelName = channelName;
    this.groupId = groupId;
    this.createdBy = createdBy;
    this.messages = messages;
  }

  addMessage(message) {
    this.messages.push(message);
  }
}

class Message {
  constructor(messageId, senderId, content) {
    this.messageId = messageId;
    this.senderId = senderId;
    this.content = content;
  }
}

module.exports = {
  User,
  Group,
  Channel,
  Message
};
