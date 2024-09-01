class ChatUser {
  constructor(username, email, password, roles = ['User'], groups = []) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.groups = groups;
  }
}

class Group {
  constructor(name, admin) {
    this.name = name;
    this.admin = admin;
    this.channels = [];
    this.members = [];
  }
}

class Channel {
  constructor(name, group) {
    this.name = name;
    this.group = group;
    this.messages = [];
  }
}

class Message {
  constructor(sender, content) {
    this.sender = sender;
    this.content = content;
    this.timestamp = new Date();
  }
}

module.exports = {
  ChatUser,
  Group,
  Channel,
  Message
};
