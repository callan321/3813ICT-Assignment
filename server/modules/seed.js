const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');
const { User, Group, Channel, Message } = require('./models');
const fs = require('fs');
const path = require('path');


(async function clearImagesDirectory() {
  // Correct path to navigate one directory up and then into 'images'
  const imagesDir = path.join(__dirname, '..', 'images');

  // Check if the images directory exists
  if (fs.existsSync(imagesDir)) {
    // Read all files in the directory
    const files = fs.readdirSync(imagesDir);

    // Delete each file
    for (const file of files) {
      fs.unlinkSync(path.join(imagesDir, file));
      console.log(`Deleted file: ${file}`);
    }
  } else {
    console.log('No images directory found. Skipping image deletion.');
  }
})();


(async function seedDatabase() {
  try {
    // Connect to the database
    const { db, client } = await connectToDatabase();

    // Drop existing collections if they exist
    const collections = ['users', 'groups', 'channels'];
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const exists = await collection.countDocuments({});
      if (exists) {
        await collection.drop();
        console.log(`Dropped existing collection: ${collectionName}`);
      }
    }

    // Create initial users
    const user1 = new User('super', 'superadmin@example.com', '123', ['super_admin'], []);
    const user2 = new User('user', 'testuser@example.com', '123', ['user'], []);
    const users = [user1, user2];

    // Insert users into 'users' collection
    await db.collection('users').insertMany(users);
    console.log('Inserted users:', users.map(u => u.username));

    // Create a group with user1 as admin and user2 as member
    const group1 = new Group('Test Group', user1._id, [user1._id], [user2._id], []);
    await db.collection('groups').insertOne(group1);
    console.log('Created group:', group1.groupName);

    // Update users to include the group in their 'groups' field
    await db.collection('users').updateOne(
      { _id: user1._id },
      { $push: { groups: group1._id } }
    );
    await db.collection('users').updateOne(
      { _id: user2._id },
      { $push: { groups: group1._id } }
    );
    console.log('Updated users with group information');

    // Create a channel in the group
    const channel1 = new Channel('General', user1._id, group1._id, []);
    await db.collection('channels').insertOne(channel1);
    console.log('Created channel:', channel1.channelName);

    // Add the channel's _id to the group's 'channels' array
    await db.collection('groups').updateOne(
      { _id: group1._id },
      { $push: { channels: channel1._id } }
    );
    console.log('Added channel to group');

    // Create messages and add them to the channel
    const message1 = new Message(user1._id, 'Hello, this is a test message', 'txt');
    const message2 = new Message(user2._id, 'Hello, reply to test message', 'txt');

    // Update the channel to include the messages
    await db.collection('channels').updateOne(
      { _id: channel1._id },
      { $push: { messages: { $each: [message1, message2] } } }
    );
    console.log('Added messages to channel');

    // Close the database connection
    await client.close();
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
})();
