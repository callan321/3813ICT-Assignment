const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PeerServer } = require('peer');

const callServer = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST']
    }
  });

  // Create PeerJS server
  const peerServer = PeerServer({
    port: 3002, // Hardcoded port for PeerJS
    path: '/peerjs'
  });

  // Socket.IO event handling
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle joining a channel for video calls
    socket.on('joinChannel', (channelId) => {
      socket.join(channelId);
      console.log(`Client ${socket.id} joined channel ${channelId}`);
    });

    // Handle dropping out of a channel
    socket.on('leaveChannel', (channelId) => {
      socket.leave(channelId);
      console.log(`Client ${socket.id} left channel ${channelId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Start HTTP server on port 3001
  httpServer.listen(3001, () => {
    console.log(`Call server is running on http://localhost:3001`);
    console.log(`PeerJS server is running on http://localhost:3002/peerjs`);
  });
};

module.exports = callServer;
