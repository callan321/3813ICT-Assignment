class User {
  constructor(username, email, password, roles = ['user'], groups = []) {
    this._id = new ObjectId();
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.groups = groups;
  }
}

class Group {
  constructor(groupName, createdBy, admins = [], members = [], channels = [], channels1) {
    this._id = new ObjectId();
    this.groupName = groupName;
    this.createdBy = createdBy;
    this.admins = admins;
    this.members = members;
    this.channels = channels; // Channel reference
  }
}

// abstract class
class ChannelReference {
  constructor(_id, channelName) {
    this._id = new ObjectId();
    this.channelName = channelName;
  }
}

const { ObjectId } = require('mongodb');

class Channel {
  constructor(channelName, createdBy, groupId, messages = []) {
    this._id = new ObjectId();
    this.channelName = channelName;
    this.groupId = groupId;
    this.createdBy = createdBy;
    this.messages = messages; // should be of class message
  }

}


class Message {
  constructor(senderId, content, type) {
    this._id = new ObjectId();
    this.senderId = senderId;
    this.content = content;
    this.type = type // should be img or msg;
  }
}

module.exports = {
  User,
  Group,
  Channel,
  Message
};
