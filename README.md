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

# Assignment Phase 2 Additions

In this phase of the assignment, we have extended the functionality of our chat application based on the requirements specified for Assignment Phase 2. The key additions include integrating MongoDB for data storage and adding image support.

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
- **channels**: string[] (Array of Channel IDs)

### Channel

- **_id**: string (MongoDB ObjectId)
- **channelName**: string
- **createdBy**: string
- **groupId**: string
- **messages**: Message[]

### Message

- **_id**: string (MongoDB ObjectId)
- **senderId**: string
- **content**: string
- **type**: string ('img' or 'txt')
- **timestamp**: Date

---

## Updated API Endpoints

### Groups and Channels

- `GET /api/groups/user/:userId`
  - Retrieve groups and channels for a specific user.

- `GET /api/channel/:channelId`
  - Retrieve details of a specific channel, including messages.

- `POST /api/channel/:channelId/message`
  - Post a new text message to a channel.

- `POST /api/channel/:channelId/upload-image`
  - Upload an image to a channel.

- `GET /api/channel/name/:channelId`
  - Retrieve the name of a specific channel.

### Users

- `GET /api/users`
  - Retrieve all users.

- `GET /api/users/:id`
  - Retrieve a user by ID.

- `POST /api/users`
  - Create a new user.

- `PUT /api/users/:id`
  - Update a user.

- `DELETE /api/users/:id`
  - Delete a user.

### Authentication

- `POST /api/login`
  - User login.

---

## Angular Architecture

### New Components

- **ChannelComponent**
  - Manages chat within a channel, displays messages, allows sending new messages, and handles image uploads.

### Updated Components

- **SidebarComponent**
  - Displays the groups and channels the user is part of.
  - Allows navigation to different channels.

### Services

- **AuthService**
  - Added methods to get the current user's ID.
  - Manages user authentication and authorization.

- **ChannelService**
  - Handles communication with the server regarding channels, messages, and image uploads.

- **GroupService**
  - Manages retrieval and updates related to groups and channels.

- **UserService**
  - Fetches user information, such as usernames for display.

---

## MongoDB Integration

- Switched from JSON file storage to MongoDB for persisting data.
- Collections used:
  - `users`
  - `groups`
  - `channels`
  - `messages`
- Controllers updated to interact with MongoDB using the MongoDB Node.js Driver.

### Connection Helper Function

Established a helper function to connect to the MongoDB database, ensuring database operations are streamlined.

---

## How the Components Interact

- **Client Side:**
  - `ChannelComponent` communicates with the server to fetch and display messages, handles sending messages and image uploads.
  - `SidebarComponent` allows users to select groups and channels.
  - `AuthService` handles authentication and stores user data.
  - `ChannelService` manages real-time communication and message handling.
  - `UserService` retrieves user information for display purposes.

- **Server Side:**
  - `userController.js` handles API requests related to users.
  - `groupController.js` handles API requests related to groups.
  - `channelController.js` handles API requests related to channels and messages.
  - `auth.js` handles authentication.
  - `server.js` sets up the Express server, routes, and Socket.IO for real-time communication.

---

## Updated Requirements

- [x] **MongoDB Integration**
  - Data is now stored and managed using MongoDB.

- [x] **Real-Time Chat Functionality**
  - Implemented using Socket.IO for real-time messaging.

- [x] **Image Support**
  - Users can upload and view images within channels.

- [ ] **Video Support**
  - *To be implemented.*

## Testing

### Server
```
cd server
```
- To seed the database with initial data:

```
npm run seed
```

- To start the server:

```
npm run dev
```

- To test the server:
- 
```
npm test
```

### Client
- To dev server:

```
ng serve
```

- To run tests:
```
ng test
```

