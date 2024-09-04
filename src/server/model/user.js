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

let users = [
  new User(1, 'super', 'super@example.com', '123', ['Super Admin']),
  new User(2, 'user', 'regular@example.com', 'password', ['User']),
];

module.exports = {
  User,
  users,
};
