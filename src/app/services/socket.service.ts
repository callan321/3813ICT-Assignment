import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Connect to the Socket.IO server on port 3001
    this.socket = io('http://localhost:3001');
  }

  // Emit an event to send your own Peer ID
  sendPeerId(peerId: string) {
    this.socket.emit('registerPeerId', { peerId });
  }

  // Listen for other peers' IDs
  onPeerId(callback: (data: any) => void) {
    this.socket.on('peerId', callback);
  }

  // Handle disconnect event
  disconnect() {
    this.socket.disconnect();
  }
}
