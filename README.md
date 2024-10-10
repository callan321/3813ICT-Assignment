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
# Angular reticular 
## Components
- **LoginComponent:** Handles the user login functionality, including the form to input credentials and the logic to submit the login data.
- **HomeComponent:** Acts as the landing page for authenticated users, typically containing dashboard-related information.
- **SidebarComponent:** This component is responsible for rendering the navigation sidebar, which contains links to various parts of the app like users, groups, and logout functionality.
- **GroupsComponent:** Displays and manages group-related information such as listing available groups, adding channels, and managing group members.
- **UsersComponent:** Displays and manages user-related data, including CRUD operations on users and roles management.
- **CreateUserComponent:** Handles user registration and creating new users within the app.

## Services

### AuthService

- User login session storage (storing userId, username, and roles in localStorage).
- Retrieving user roles to check permissions.
- Session clearing on logout.
- Role-based access control, such as determining if the user is a super_admin or group_admin.


### AuthGuard 
Protect routes from unauthenticated users 

AdminGuard and GroupGuard were not fully implemented but were designed to protect routes depending on roles. 

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

# Part 2: Assignment Phase 2 Additions

In this phase of the assignment, we have extended the functionality of our chat application based on the requirements specified for Assignment Phase 2. The key addition includes integrating MongoDB for data storage.

## Data Structures

### User

- **_id**: string (MongoDB ObjectId)
- **username**: string
- **email**: string
- **password**: string
- **roles**: string[]
- **groups**: string[]

### Group

- **_id**: string (MongoDB ObjectId)
- **groupName**: string
- **createdBy**: string
- **admins**: string[]
- **members**: string[]
- **channels**: Channel[]

### Channel

- **_id**: string (MongoDB ObjectId)
- **channelName**: string
- **createdBy**: string
- **groupId**: string
- **messages**: Message[]

### Message

- **messageId**: number
- **senderId**: string
- **content**: string
- **timestamp**: Date

---

## Updated API Endpoints

### Groups and Channels

- `GET /api/groups/:userId`
  - Retrieve groups and channels for a specific user.

- `GET /api/group/:groupId/channel/:channelId`
  - Retrieve details of a specific channel within a group.

- `POST /api/group/:groupId/channel/:channelId/message`
  - Post a new message to a channel.

---

## Angular Architecture

### New Components

- **ChannelComponent**
  - Manages chat within a channel, displays messages, and allows sending new messages.

### Updated Components

- **SidebarComponent**
  - Displays the groups and channels the user is part of.
  - Allows navigation to different channels.

### Services

- **AuthService**
  - Added methods to get the current user's ID.
  - Manages user authentication and authorization.

---

## MongoDB Integration

- Switched from JSON file storage to MongoDB for persisting data.
- Collections used:
  - `users`
  - `groups`
- Controllers updated to interact with MongoDB using the MongoDB Node.js Driver.

### Connection Helper Function

Established a helper function to connect to the MongoDB database, ensuring database operations are streamlined.

---

## How the Components Interact

- **Client Side:**
  - `ChannelComponent` communicates with the server to fetch and display messages.
  - `SidebarComponent` allows users to select groups and channels.
  - `AuthService` handles authentication and stores user data.

- **Server Side:**
  - `controllers.js` handles API requests and interacts with MongoDB collections.
  - `server.js` sets up the Express server and routes.

---

## Updated Requirements

- [x] **MongoDB Integration**
  - Data is now stored and managed using MongoDB.

- [x] **Real-Time Chat Functionality**

- [ ] **Image Support**
  - *To be implemented.*

- [ ] **Video Support**
  - *To be implemented.*

## Testing 
### Server 
npm run seed
npm start 
npm test

### Client 
ng test

## Conclusion

With the integration of MongoDB, the chat application now has a robust and scalable data storage solution. This sets the foundation for implementing real-time chat functionality and other advanced features in future iterations.

