const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const { users, groups } = require('./model/user'); // Import users and groups from the model

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Server is running', port: port });
});

// Route to get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Route to get all groups
app.get('/api/groups', (req, res) => {
  res.json(groups);
});

// Route to get all channels within a group
app.get('/api/groups/:groupId/channels', (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const group = groups.find(g => g.groupId === groupId);

  if (group) {
    res.json(group.channels);
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
});

// Route to get all messages within a channel
app.get('/api/groups/:groupId/channels/:channelId/messages', (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const channelId = parseInt(req.params.channelId);
  const group = groups.find(g => g.groupId === groupId);

  if (group) {
    const channel = group.channels.find(c => c.channelId === channelId);

    if (channel) {
      res.json(channel.messages);
    } else {
      res.status(404).json({ message: 'Channel not found' });
    }
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
});

// Route to handle login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.json({ message: 'Login successful', user: { username: user.username } });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
