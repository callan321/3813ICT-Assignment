const { MongoClient } = require('mongodb');

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'ChatApp';

// Seed data
const users = [
  { id: 1, username: 'super', email: 'super@example.com', password: '123', roles: ['super_admin'], groups: [1, 2] },
  { id: 2, username: 'user', email: 'regular@example.com', password: 'password', roles: ['user'], groups: [1] },
  { id: 3, username: 'developer', email: 'dev@example.com', password: 'devpass', roles: ['user'], groups: [2, 4] },
  { id: 4, username: 'designer', email: 'designer@example.com', password: 'designpass', roles: ['user'], groups: [3] },
  { id: 5, username: 'test', email: 'test@example.com', password: 'testssds', roles: ['user'], groups: [3] },
];

const groups = [
  {
    groupId: 1, groupName: 'General Group', createdBy: 1, admins: [1], members: [1, 2],
    channels: [
      { channelId: 1, channelName: 'General Chat', createdBy: 1, messages: [
          { messageId: 1, senderId: 1, content: 'Hello, this is a message from the super admin!' },
          { messageId: 2, senderId: 2, content: 'Hi, this is a message from a regular user!' }
        ]},
      { channelId: 3, channelName: 'Empty Chat', createdBy: 1, messages: [] }
    ]
  },
  {
    groupId: 2, groupName: 'Development Group', createdBy: 2, admins: [2], members: [1, 3],
    channels: [
      { channelId: 2, channelName: 'Dev Discussions', createdBy: 2, messages: [
          { messageId: 3, senderId: 2, content: 'Let’s start discussing the new project here.' }
        ]}
    ]
  },
  {
    groupId: 3, groupName: 'Design Team', createdBy: 4, admins: [4], members: [4],
    channels: [
      { channelId: 3, channelName: 'Design Chat', createdBy: 4, messages: [
          { messageId: 4, senderId: 4, content: 'Let’s brainstorm ideas for the new project.' },
          { messageId: 5, senderId: 3, content: 'I have some mockups ready for review.' }
        ]}
    ]
  },
  {
    groupId: 4, groupName: 'Marketing Team', createdBy: 3, admins: [3], members: [3],
    channels: [
      { channelId: 4, channelName: 'Marketing Chat', createdBy: 3, messages: [
          { messageId: 6, senderId: 3, content: 'Welcome to the Marketing Team!' }
        ]}
    ]
  }
];

// Function to refresh the database
const refreshDatabase = async () => {
  const client = new MongoClient(url);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB for seeding...');

    const db = client.db(dbName);

    // Drop the collections if they exist
    await db.collection('users').drop().catch(() => console.log('Users collection does not exist.'));
    await db.collection('groups').drop().catch(() => console.log('Groups collection does not exist.'));

    // Insert seed data
    await db.collection('users').insertMany(users);
    await db.collection('groups').insertMany(groups);

    console.log('Database has been refreshed and seeded successfully!');

  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    await client.close();
  }
};

// Run the refreshDatabase function
refreshDatabase();
