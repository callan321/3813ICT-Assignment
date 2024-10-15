const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');
const { Channel } = require('./models');

const getChannelById = async (req, res) => {
  const channelId = req.params.channelId;

  // Validate channelId
  if (!ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: 'Invalid channel ID format.' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const channelsCollection = db.collection('channels');

    // Fetch the full channel data
    const channel = await channelsCollection.findOne({ _id: new ObjectId(channelId) });

    if (!channel) {
      await client.close();
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Return full channel data (including messages)
    res.json(channel);
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error fetching channel data', error: err.message });
  }
};



// Post a new message to a channel and broadcast it
const postMessageToChannel = async (req, res, io) => {
  const channelId = req.params.channelId; // No need for groupId anymore
  const { senderId, content } = req.body;

  if (!content || !senderId) {
    return res.status(400).json({ message: 'Sender ID and content are required.' });
  }

  const newMessage = {
    messageId: new Date().getTime(), // Unique message ID
    senderId,
    content,
  };

  try {
    const { db, client } = await connectToDatabase();
    const channelsCollection = db.collection('channels');

    // Update the specific channel by pushing the new message into the channel's messages array
    const result = await channelsCollection.updateOne(
      { _id: new ObjectId(channelId) },
      { $push: { messages: newMessage } } // Push the new message into the messages array
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Emit the message to the specific channel room via Socket.IO
    io.to(channelId).emit('messageBroadcast', newMessage);

    res.status(201).json({ message: 'Message posted successfully', messageData: newMessage });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error posting message', err });
  }
};

module.exports = {
  postMessageToChannel,
  getChannelById
};
