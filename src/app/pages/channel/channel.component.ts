import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import {AuthService} from "../../../services/auth.service";
import {ChannelService} from "../../../services/channel.service";


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
  channelId: string | null = null;
  channelName: string = '';
  messages: any[] = [];
  newMessage: string = '';
  senderId: string | null = ''; // Current user's ID

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Fetch the user ID
    this.senderId = this.authService.getUserId();

    // Fetch the channel ID from the route parameters
    this.channelId = this.route.snapshot.paramMap.get('channelId');

    // Check if channelId is valid and load channel data
    if (this.channelId) {
      this.loadChannelData(this.channelId);
      this.channelService.joinChannel(this.channelId);
      this.listenForMessages();
    }
  }

  // Load channel data (including messages)
  loadChannelData(channelId: string): void {
    this.channelService.getChannelData(channelId).subscribe(
      (data: any) => {
        this.channelName = data.channelName;
        this.messages = data.messages;
      },
      (error) => {
        console.error('Error loading channel data:', error);
      }
    );
  }

  // Send a new message
  sendMessage(): void {
    if (this.newMessage.trim() && this.channelId) {
      this.channelService.sendMessage(this.channelId, this.senderId!, this.newMessage).subscribe(
        (response: any) => {
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
    this.channelService.listenForMessages().subscribe((message: any) => {
      this.messages.push(message); // Add the new real-time message to the messages array
    });
  }
}
