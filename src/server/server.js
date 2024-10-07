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
  deleteGroup,
  removeUserFromGroup,
  removeAdminFromGroup,
  removeChannelFromGroup,
  upgradeToAdmin,
  addChannelToGroup
} = require('./modules/controllers'); // Adjusted path for controllers
const { loginUser } = require('./modules/auth'); // Import login logic from auth module
console.log(loginUser);
// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200', // Replace with the Angular app's URL
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

// Login Endpoint
app.post('/api/login', loginUser);


// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
