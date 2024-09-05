# Software Frameworks Assignment

## Getting Started

### 1. Clone the Repository
```
git clone https://github.com/callan321/3813ICT-Assignment.git
cd 3813ICT-Assignment
```

### 2. Install and Run Backend Dependencies
``` 
cd src/server
npm install
npm start
```

### 3. Install Frontend and Run Frontend Dependencies
``` 
npm install
ng serve
```

### 4. Follow the links:
- Backend: http://localhost:3000
- Frontend: http://localhost:4200


# Data Structures

### User
type User = {
id: number;
username: string;
email: string;
password: string;
roles: string[];
groups: number[];
};

### Group
type Group = {
groupId: number;
groupName: string;
createdBy: number;
admins: number[];
members: number[];
channels: Channel[];
};

### Channel
type Channel = {
channelId: number;
channelName: string;
createdBy: number;
groupId: number;
messages: Message[];
};

### Message
type Message = {
messageId: number;
senderId: number;
content: string;
};

# API Endpoints

## Users CRUD Endpoints

- `GET /api/users`  
  Retrieve all users.

- `POST /api/users`  
  Create a new user.

- `PUT /api/users/:id`  
  Update a user by ID.

- `DELETE /api/users/:id`  
  Delete a user by ID.

---

## Groups CRUD Endpoints

- `GET /api/groups`  
  Retrieve all groups.

- `POST /api/groups`  
  Create a new group.

- `PUT /api/groups/:groupId`  
  Update a group by ID.

- `DELETE /api/groups/:groupId`  
  Delete a group by ID.

---

### Group Member/Admin/Channel Management

- `PUT /api/groups/:groupId/remove-member/:userId`  
  Remove a user from a group.

- `PUT /api/groups/:groupId/remove-admin/:adminId`  
  Remove an admin from a group.

- `PUT /api/groups/:groupId/remove-channel/:channelId`  
  Remove a channel from a group.

- `PUT /api/groups/:groupId/upgrade-to-admin/:userId`  
  Upgrade a user to admin in a group.

- `POST /api/groups/:groupId/add-channel`  
  Add a channel to a group.

---

## Login Endpoint

- `POST /api/login`  
  Login a user.

---

## Requirements
- [x] Login
- [x] Side Bar
- [x] User Auth
- [x] Logout

#### Super Administrator

- [x] Promote a chat user to Group Admin role
- [x] Remove any chat users
- [x] Upgrade a chat user to Super Admin role
- [x] Perform all functions of a Group Administrator

#### Group Administrator

- [x] Create groups
- [x] Create channels within groups
- [x] Remove groups, channels, and chat users from groups they administer
- [x] Delete a chat user (from a group they administer)
- [x] Modify/delete a group they created
- [ ] Ban a user from a channel and report to super admins

#### Regular User

- [ ] Create a new chat user
- [ ] Join any channel in a group
- [ ] Register interest in a group
- [ ] Leave a group
- [ ] Delete themselves
