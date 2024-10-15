const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');
const { User } = require('./models');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    res.json(users);
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', err });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const newUser = new User(
    req.body.username,
    req.body.email,
    req.body.password,
    req.body.roles,
    req.body.groups
  );

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User created', user: { _id: result.insertedId, ...newUser } });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', err });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const userId = req.params.id;

  // Ensure the ID is a valid ObjectId
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Attempt to update the user with the provided ID
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: req.body }
    );

    // Handle the case where no document matched the provided ID
    if (result.matchedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated', user: req.body });
    await client.close();
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user', err });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Ensure the ID is a valid ObjectId
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Attempt to delete the user with the provided ID
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    // Handle the case where no document matched the provided ID
    if (result.deletedCount === 0) {
      await client.close();
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
    await client.close();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', err });
  }
};


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
