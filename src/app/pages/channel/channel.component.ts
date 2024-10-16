import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  channelId: string | null = null;
  channelName: string = '';
  messages: any[] = [];
  newMessage: string = '';
  selectedFile: File | null = null;
  senderId: string | null = '';

  // Store user names
  userNames: { [userId: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.senderId = this.authService.getUserId();
    this.channelId = this.route.snapshot.paramMap.get('channelId');

    if (this.channelId) {
      this.loadChannelData(this.channelId);
      this.channelService.joinChannel(this.channelId);
      this.listenForMessages();
    }
  }

  loadChannelData(channelId: string): void {
    this.channelService.getChannelData(channelId).subscribe(
      (data: any) => {
        this.channelName = data.channelName;
        this.messages = data.messages;

        // Fetch user names for the existing messages
        this.messages.forEach(message => {
          this.fetchUserName(message.senderId);
        });
      },
      (error) => {
        console.error('Error loading channel data:', error);
      }
    );
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.channelId) {
      this.channelService.sendMessage(this.channelId, this.senderId!, this.newMessage).subscribe(
        (response: any) => {
          this.newMessage = '';
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (this.selectedFile && this.channelId && this.senderId) {
      this.channelService.uploadImage(this.channelId, this.senderId, this.selectedFile).subscribe(
        (response: any) => {
          this.selectedFile = null;
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }

  getImageUrl(filename: string): string {
    return `http://localhost:3000/images/${filename}`;
  }

  listenForMessages(): void {
    this.channelService.listenForMessages().subscribe((message: any) => {
      this.fetchUserName(message.senderId);
      this.messages.push(message);
    });
  }

  // Fetch user name using UserService
  fetchUserName(userId: string): void {
    if (!this.userNames[userId]) {
      this.userService.getUserById(userId).subscribe(
        (user: any) => {
          this.userNames[userId] = user.username; // Use 'username' instead of 'name'
        },
        (error) => {
          console.error('Error fetching user name:', error);
        }
      );
    }
  }

  getUserName(userId: string): string {
    return this.userNames[userId] || 'Loading...';
  }
}
