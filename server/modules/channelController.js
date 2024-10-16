const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');


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
    type: 'txt',
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

const uploadImageToChannel = async (req, res, io) => {
  const channelId = req.params.channelId;

  // Validate channelId
  if (!ObjectId.isValid(channelId)) {
    console.error(`Invalid channel ID: ${channelId}`);
    return res.status(400).json({ message: 'Invalid channel ID format.' });
  }

  try {
    // Setup formidable to parse the form
    const form = new formidable.IncomingForm();
    const imageDir = path.join(__dirname, '../images'); // Directory for images
    form.uploadDir = imageDir;
    form.keepExtensions = true;

    // Ensure the 'images' directory exists
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }

    // Parse the form data and handle the uploaded file
    await form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ message: 'Error parsing form data.' });
      }

      const file = files.file instanceof Array ? files.file[0] : files.file;

      // Check if the file is present
      if (!file || !file.filepath || !file.originalFilename) {
        console.error("No valid file uploaded.");
        return res.status(400).json({ message: 'No valid file uploaded.' });
      }

      // Create a new unique filename and save the file
      const newFileName = `${new ObjectId()}_${file.originalFilename}`;
      const newFilePath = path.join(imageDir, newFileName);

      try {
        await fs.promises.rename(file.filepath, newFilePath);
      } catch (renameError) {
        console.error("Error saving the file:", renameError);
        return res.status(500).json({ message: 'Error saving the uploaded file.' });
      }

      // Add the new image message to the channel
      const { db, client } = await connectToDatabase();
      const channelsCollection = db.collection('channels');
      const newMessage = {
        messageId: new ObjectId(),
        senderId: fields.senderId instanceof Array ? fields.senderId[0] : fields.senderId,
        content: newFileName,
        type: 'img',
      };

      const result = await channelsCollection.updateOne(
        { _id: new ObjectId(channelId) },
        { $push: { messages: newMessage } }
      );

      if (result.matchedCount === 0) {
        await client.close();
        return res.status(404).json({ message: 'Channel not found.' });
      }

      // Broadcast the new image message via Socket.IO
      io.to(channelId).emit('messageBroadcast', newMessage);

      res.status(201).json({ message: 'Image uploaded and message added.', newMessage });

      // Close database connection
      await client.close();
    });
  } catch (err) {
    console.error("Error during image upload:", err);
    res.status(500).json({ message: 'Error during image upload.' });
  }
};

const getChannelNameById = async (req, res) => {
  const channelId = req.params.channelId;

  // Validate channelId
  if (!ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: 'Invalid channel ID format.' });
  }

  try {
    const { db, client } = await connectToDatabase();
    const channelsCollection = db.collection('channels');

    // Fetch only the 'channelName' field of the channel
    const channel = await channelsCollection.findOne(
      { _id: new ObjectId(channelId) },
      { projection: { channelName: 1 } }
    );

    if (!channel) {
      await client.close();
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Return only the channel name as 'name'
    res.json({ name: channel.channelName });
    await client.close();
  } catch (err) {

    res.status(500).json({ message: 'Error fetching channel name', error: err.message });
  }
};



module.exports = {
  postMessageToChannel,
  getChannelById,
  uploadImageToChannel,
  getChannelNameById
};
