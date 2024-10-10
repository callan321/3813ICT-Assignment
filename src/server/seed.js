const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'ChatApp';

// Users: super and test user
const users = [
  {
    username: 'super',
    email: 'superadmin@example.com',
    password: '123',
    roles: ['super_admin'],
    groups: []
  },
  {
    username: 'user',
    email: 'testuser@example.com',
    password: '123',
    roles: ['user'],
    groups: []
  }
];

// Groups
const groups = [
  {
    groupName: 'General Group',
    createdBy: '',
    admins: [],
    members: [],
    channels: [
      {
        _id: new ObjectId(),  // Add ObjectId for the channel
        channelName: 'General Chat',
        createdBy: '',
        messages: []
      }
    ]
  },
  {
    groupName: 'Admin Group',
    createdBy: '',
    admins: [],
    members: [],
    channels: [
      {
        _id: new ObjectId(),  // Add ObjectId for the channel
        channelName: 'Admin Discussions',
        createdBy: '',
        messages: []
      }
    ]
  }
];

const seedDatabase = async () => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to MongoDB...');

    const db = client.db(dbName);

    // Drop existing collections to refresh the database
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Dropped collection: ${collection.name}`);
    }

    // Insert users
    const usersCollection = db.collection('users');
    const insertedUsers = await usersCollection.insertMany(users);
    console.log('Inserted users:', insertedUsers.insertedIds);

    // Retrieve user IDs
    const superId = insertedUsers.insertedIds[0];
    const testId = insertedUsers.insertedIds[1];

    // Group 1: General Group (both super and test user)
    groups[0].createdBy = superId;
    groups[0].admins = [superId];
    groups[0].members = [superId, testId];
    groups[0].channels[0].createdBy = superId;
    groups[0].channels[0].messages.push(
      { senderId: superId, content: 'Welcome to the General Group!' },
      { senderId: testId, content: 'Thanks! Glad to be here.' }
    );

    // Group 2: Admin Group (only super)
    groups[1].createdBy = superId;
    groups[1].admins = [superId];
    groups[1].members = [superId];
    groups[1].channels[0].createdBy = superId;
    groups[1].channels[0].messages.push(
      { senderId: superId, content: 'Admin-only discussions here.' }
    );

    // Insert groups
    const groupsCollection = db.collection('groups');
    const insertedGroups = await groupsCollection.insertMany(groups);
    console.log('Inserted groups:', insertedGroups.insertedIds);

    // Update users to reference their respective groups
    const generalGroupId = insertedGroups.insertedIds[0];
    const adminGroupId = insertedGroups.insertedIds[1];

    await usersCollection.updateOne(
      { _id: superId },
      { $set: { groups: [generalGroupId, adminGroupId] } }
    );

    await usersCollection.updateOne(
      { _id: testId },
      { $set: { groups: [generalGroupId] } }
    );

    console.log('Users updated with group IDs.');

  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    await client.close();
  }
};

// Run the seed function
seedDatabase();
