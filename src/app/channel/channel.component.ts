import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // For route parameters
import { HttpClient } from '@angular/common/http'; // For making HTTP requests
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { io, Socket } from 'socket.io-client'; // Import socket.io-client

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  groupId: string | null = null;
  channelId: string | null = null;
  groupName: string = '';
  channelName: string = '';
  messages: any[] = [];
  newMessage: string = '';

  // Define the Socket.IO client instance
  private socket: Socket;

  // Base API URL (replace with your actual backend URL if different)
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    // Initialize Socket.IO connection
    this.socket = io('http://localhost:3000'); // Connect to your backend's Socket.IO server
  }

  // Update how you fetch the parameters in ngOnInit()
  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.channelId = this.route.snapshot.paramMap.get('channelId');

    console.log(`Group ID: ${this.groupId}, Channel ID: ${this.channelId}`);

    // Check if the parameters are valid and load channel data
    if (this.groupId && this.channelId) {
      this.loadChannelData(this.groupId, this.channelId);
      this.listenForMessages();
    }
  }

  // Load chat history for the selected group and channel
  loadChannelData(groupId: string, channelId: string): void {
    const apiUrl = `${this.apiBaseUrl}/group/${groupId}/channel/${channelId}`; // API endpoint

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        this.groupName = data.groupName;
        this.channelName = data.channelName;
        this.messages = data.messages;
        console.log('Chat history loaded:', data);
      },
      (error) => {
        console.error('Error loading channel data:', error);
      }
    );
  }


  // Send a new message and post it to the server
  sendMessage(): void {
    if (this.newMessage.trim() && this.groupId && this.channelId) {
      const messageData = {
        senderId: 123, // Replace with actual user ID if needed
        content: this.newMessage
      };

      const apiUrl = `${this.apiBaseUrl}/group/${this.groupId}/channel/${this.channelId}/message`;

      // Post the message to the server
      this.http.post(apiUrl, messageData).subscribe(
        (response: any) => {
          console.log('Message posted:', response);
          this.newMessage = ''; // Clear input field after sending
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }

  // Listen for real-time messages from Socket.IO
  listenForMessages(): void {
    this.socket.on('messageBroadcast', (message: any) => {
      console.log('Real-time message received:', message);
      this.messages.push(message); // Add the new real-time message to the messages array
    });
  }
}
