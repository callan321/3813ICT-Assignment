const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'ChatApp';

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login request data:', username, password);

  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const client = new MongoClient(url);

    // Await connection to MongoDB
    await client.connect();
    console.log('Connected to MongoDB successfully!');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Log the query parameters
    console.log('Querying for user with:', { username, password });

    // Query the database using async/await
    const user = await usersCollection.findOne({ username: username, password: password });

    // Log the result of the query
    console.log('Database query result:', user);

    if (user) {
      console.log('User found, logging in:', user);
      res.json({
        message: 'Login successful',
        user: {
          id: user.id, // MongoDB uses _id by default
          username: user.username,
          roles: user.roles
        }
      });
    } else {
      console.log('Invalid username or password');
      res.status(401).json({ message: 'Invalid username or password' });
    }

    // Close the database connection
    await client.close();
    console.log('MongoDB connection closed');

  } catch (err) {
    console.error('Error connecting to MongoDB or querying database:', err);
    res.status(500).json({ message: 'Error logging in', err });
  }
};

module.exports = { loginUser };
