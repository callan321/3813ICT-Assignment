const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const { users } = require('./model/user');

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ status: 'Server is running', port: port });
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

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
  console.log(`http://localhost:${port}/api`);
});

