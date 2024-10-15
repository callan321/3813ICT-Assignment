import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiBaseUrl = 'http://localhost:3000/api';
  private socket: Socket;

  constructor(private http: HttpClient) {
    // Initialize the Socket.IO connection
    this.socket = io('http://localhost:3000');
  }

  // Fetch channel data (group and channel details, messages)
  getChannelData(channelId: string): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/channel/${channelId}`;
    return this.http.get(apiUrl);
  }

  // Send a message to the server
  sendMessage(channelId: string, senderId: string, content: string): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/channel/${channelId}/message`;
    return this.http.post(apiUrl, { senderId, content });
  }

  // Emit to join a specific channel room for real-time messaging
  joinChannel(channelId: string): void {
    this.socket.emit('joinChannel', channelId);
  }

  // Listen for real-time messages from Socket.IO
  listenForMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('messageBroadcast', (message: any) => {
        observer.next(message);
      });
    });
  }
}
