import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeerService } from "../services/peer.service";
import { SocketService } from "../services/socket.service";
import { NgForOf } from "@angular/common";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit, OnDestroy {
  localStream: MediaStream | null = null;
  availablePeers: string[] = [];
  peerId: string = '';
  connectedPeers: { peerId: string, stream: MediaStream }[] = [];
  private peerIdSubscription: Subscription | undefined;

  constructor(
    private socketService: SocketService,
    private peerService: PeerService
  ) {}

  ngOnInit(): void {
    this.setupLocalStream();

    // Subscribe to the peerId observable
    this.peerIdSubscription = this.peerService.getPeerId$().subscribe(id => {
      if (id) {
        this.peerId = id;
        // Send your Peer ID to the server
        this.socketService.sendPeerId(this.peerId);
      }
    });

    // Listen for available peers
    this.socketService.onPeerId((data: any) => {
      if (data.peerId !== this.peerId && !this.availablePeers.includes(data.peerId)) {
        this.availablePeers.push(data.peerId);
      }
    });

    // Listen for incoming calls and answer them
    this.peerService.onCall((call) => {
      if (this.localStream) {
        this.peerService.answerCall(call, this.localStream); // Answer the call with the local stream
        call.on('stream', (remoteStream: MediaStream) => {
          this.connectedPeers.push({ peerId: call.peer, stream: remoteStream });
        });
      } else {
        console.error('Local stream not available to answer the call.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.peerIdSubscription) {
      this.peerIdSubscription.unsubscribe();
    }

    // Stop local stream when leaving the page
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Disconnect from Socket.IO and PeerJS
    this.socketService.disconnect();
    this.peerService.disconnect();
  }

  // Set up the local video stream
  async setupLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      localVideo.srcObject = this.localStream;
    } catch (error) {
      console.error('Error accessing local stream: ', error);
    }
  }

  // Call a peer
  callPeer(peerId: string) {
    const call = this.peerService.callPeer(peerId, this.localStream!);
    if (call) {
      call.on('stream', (remoteStream: MediaStream) => {
        this.connectedPeers.push({ peerId, stream: remoteStream });
      });
    } else {
      console.error('Failed to establish call with peer:', peerId);
    }
  }
}
