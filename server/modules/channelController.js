const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');
const { Channel } = require('./models');



// Post a new message to a channel and broadcast it
const postMessageToChannel = async (req, res, io) => {
  const groupId = req.params.groupId;
  const channelId = req.params.channelId;
  const { senderId, content } = req.body;

  if (!content || !senderId) {
    return res.status(400).json({ message: 'Sender ID and content are required.' });
  }

  const newMessage = {
    messageId: new Date().getTime(),
    senderId,
    content,
  };

  try {
    const { db, client } = await connectToDatabase();
    const groupsCollection = db.collection('groups');

    // Update the specific group and channel by pushing the new message into the channel's messages array
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId), 'channels._id': new ObjectId(channelId) },
      { $push: { 'channels.$.messages': newMessage } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Group or channel not found' });
    }

    // Emit the message to the specific channel room
    io.to(channelId).emit('messageBroadcast', newMessage);

    res.status(201).json({ message: 'Message posted successfully', messageData: newMessage });
    await client.close();
  } catch (err) {
    res.status(500).json({ message: 'Error posting message', err });
  }
};

module.exports = {
  postMessageToChannel
};
