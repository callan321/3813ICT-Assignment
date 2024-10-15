const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'ChatApp';

// Database connection helper function
const connectToDatabase = async () => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  return { db, client };
};

module.exports = { connectToDatabase };
