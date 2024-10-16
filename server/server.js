const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { loginUser } = require('./modules/auth');
const socketHandler = require('./modules/socket');
const userController = require('./modules/userController');
const groupController = require('./modules/groupController');
const channelController = require('./modules/channelController');
const {join} = require("node:path");
const callServer = require("./callServer");


// sever
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
// Initialize Socket.IO on the server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});
// socket logic
socketHandler(io);

// Status endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', port: port });
});

// Users Endpoints
app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:id', userController.getUserById);
app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

// Groups and channel (non-socket) Endpoints
app.get('/api/groups', groupController.getAllGroups);
app.post('/api/groups', groupController.createGroup);
app.get('/api/groups/:groupId', groupController.getGroupById);
app.put('/api/groups/:groupId', groupController.updateGroup);
app.delete('/api/groups/:groupId', groupController.deleteGroup);
app.put('/api/groups/:groupId/remove-member/:userId', groupController.removeUserFromGroup);
app.put('/api/groups/:groupId/remove-admin/:adminId', groupController.removeAdminFromGroup);
app.put('/api/groups/:groupId/remove-channel/:channelId', groupController.removeChannelFromGroup);
app.put('/api/groups/:groupId/upgrade-to-admin/:userId', groupController.upgradeToAdmin);
app.post('/api/groups/:groupId/add-channel', groupController.addChannelToGroup);
app.get('/api/groups/:userId', groupController.getGroupsAndChannelsForUser);
app.put('/api/groups/:groupId/add-user/:userId', groupController.addUserToGroup);


// Channel-specific message endpoint handled by Socket.IO
app.get('/api/channel/:channelId', channelController.getChannelById);
app.get('/api/channel/name/:channelId', channelController.getChannelNameById)
app.post('/api/channel/:channelId/message', (req, res) => channelController.postMessageToChannel(req, res, io));
app.post('/api/channel/:channelId/upload-image', (req, res) => channelController.uploadImageToChannel(req, res, io));

// images being served statically
app.use('/images', express.static(join(__dirname, 'images')));

// Login Endpoint
app.post('/api/login', loginUser);

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
server.listen(port, () => {
  console.log(`Main Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

// call the sever that handles calls
// callServer();

module.exports = { app, server };
