const express = require('express');
const cors = require('cors');
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
  deleteGroup, removeUserFromGroup, removeAdminFromGroup, removeChannelFromGroup, upgradeToAdmin
} = require('./modules/controllers'); // Adjusted path for controllers

const { loginUser } = require('./modules/auth'); // Import login logic from auth module

app.use(cors());
app.use(express.json());

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

// Login Endpoint
app.post('/api/login', loginUser);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
