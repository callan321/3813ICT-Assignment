class User {
  constructor(username, email, password, roles = ['user'], groups = []) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.groups = groups;
  }
}

class Group {
  constructor(groupName, createdBy, admins = [], members = [], channels = [], channels1) {
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

const { ObjectId } = require('mongodb');

class Channel {
  constructor(channelName, createdBy, groupId, messages = []) {
    this._id = new ObjectId(); // This will assign a unique ObjectId to each channel.
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
  constructor(senderId, content) {
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
