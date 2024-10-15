module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Listen for 'joinChannel' from the client
    socket.on('joinChannel', (channelId) => {
      socket.join(channelId);
      console.log(`Client ${socket.id} joined channel ${channelId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
