const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'ChatApp';
let db;

const connectToDatabase = (callback) => {
  if (db) {
    return callback(null, db);
  }

  MongoClient.connect(url, (err, client) => {
    if (err) {
      return callback(err, null);
    }
    console.log("Connected to MongoDB successfully!");
    db = client.db(dbName);
    return callback(null, db);
  });
};

module.exports = { connectToDatabase };
