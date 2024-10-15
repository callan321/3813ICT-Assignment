const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { loginUser } = require('./modules/auth');
const socketHandler = require('./modules/socket');
const userController = require('./modules/userController');
const groupController = require('./modules/groupController');
const channelController = require('./modules/channelController');


// sever
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Middleware
app.use(cors());
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
app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

// Groups and channel (non-socket) Endpoints
app.get('/api/groups', groupController.getAllGroups);
app.post('/api/groups', groupController.createGroup);
app.put('/api/groups/:groupId', groupController.updateGroup);
app.delete('/api/groups/:groupId', groupController.deleteGroup);
app.put('/api/groups/:groupId/remove-member/:userId', groupController.removeUserFromGroup);
app.put('/api/groups/:groupId/remove-admin/:adminId', groupController.removeAdminFromGroup);
app.put('/api/groups/:groupId/remove-channel/:channelId', groupController.removeChannelFromGroup);
app.put('/api/groups/:groupId/upgrade-to-admin/:userId', groupController.upgradeToAdmin);
app.post('/api/groups/:groupId/add-channel', groupController.addChannelToGroup);
app.get('/api/groups/:userId', groupController.getGroupsAndChannelsForUser);

// Channel-specific message endpoint handled by Socket.IO
app.post('/api/channel/:channelId/message', (req, res) => channelController.postMessageToChannel(req, res, io));
app.get('/api/channel/:channelId', channelController.getChannelById);


// Login Endpoint
app.post('/api/login', loginUser);

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
