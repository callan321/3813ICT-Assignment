const { users } = require('./models'); // Import users from models

const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // If user exists and password matches, return success response
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username, roles: user.roles } });
  } else {
    // If credentials are incorrect, return error
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

module.exports = { loginUser };
