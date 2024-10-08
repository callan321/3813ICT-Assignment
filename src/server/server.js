const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

// Import controllers and authentication module
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  removeUserFromGroup,
  removeAdminFromGroup,
  removeChannelFromGroup,
  upgradeToAdmin,
  addChannelToGroup,
  getGroupChannelInfo,
  postMessageToChannel,
  getGroupsAndChannelsForUser
} = require('./modules/controllers');
const { loginUser } = require('./modules/auth');

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Status endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', port: port });
});

// Users CRUD Endpoints
app.get('/api/users', getAllUsers);
app.post('/api/users', createUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

// Groups CRUD Endpoints
app.get('/api/groups', getAllGroups);
app.post('/api/groups', createGroup);
app.put('/api/groups/:groupId', updateGroup);
app.delete('/api/groups/:groupId', deleteGroup);

app.put('/api/groups/:groupId/remove-member/:userId', removeUserFromGroup);
app.put('/api/groups/:groupId/remove-admin/:adminId', removeAdminFromGroup);
app.put('/api/groups/:groupId/remove-channel/:channelId', removeChannelFromGroup);
app.put('/api/groups/:groupId/upgrade-to-admin/:userId', upgradeToAdmin);
app.post('/api/groups/:groupId/add-channel', addChannelToGroup);

// Group and channel info endpoints
app.get('/api/group/:groupId/channel/:channelId', getGroupChannelInfo);
app.post('/api/group/:groupId/channel/:channelId/message', (req, res) => postMessageToChannel(req, res, io));

// Route to get groups and channels for the logged-in user
app.get('/api/groups/:userId', getGroupsAndChannelsForUser);

// Login Endpoint
app.post('/api/login', loginUser);

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Create an HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO on the server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

// In your server.js or equivalent file

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Listen for 'joinChannel' from the client
  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
    console.log(`Client ${socket.id} joined channel ${channelId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
