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


## Requirements
- [x] Login
- [x] Side Bar
- [x] User Auth
- [x] Logout

### Roles 

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

### Admin CRUD
- [x] Create Admins
- [x] Read Admins
- [x] Update Admins
- [x] Delete Admins

### Groups CRUD
- [x] Create Groups
- [x] Read Groups
- [x] Update Groups
- [x] Delete Groups

### Channels CRUD
- [x] Create Channels
- [ ] Read Channels
- [ ] Update Channels
- [x] Delete Channels
