import { Injectable } from '@angular/core';
import { MediaConnection, Peer } from 'peerjs';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  private peer: Peer;
  private peerIdSubject = new BehaviorSubject<string | null>(null);
  peerId$ = this.peerIdSubject.asObservable();

  constructor() {
    // Connect to PeerJS server running on port 3002
    this.peer = new Peer({
      host: 'localhost',
      port: 3002,
      path: '/peerjs',
      secure: false, // Change to true if using HTTPS in production
    });

    // Wait for the peer to open and generate an ID
    this.peer.on('open', (id: string) => {
      this.peerIdSubject.next(id);
      console.log('Peer ID: ', id);
    });

    // Handle any potential errors from PeerJS
    this.peer.on('error', (err) => {
      console.error('PeerJS error:', err);
    });
  }

  getPeerId$() {
    return this.peerId$;
  }


  // Call another peer and return the MediaConnection object
  callPeer(peerId: string, stream: MediaStream): MediaConnection | null {
    if (!peerId || !stream) {
      console.error('Cannot make call: Peer ID or stream is missing.');
      return null;
    }
    const call = this.peer.call(peerId, stream);
    if (call) {
      console.log('Calling peer:', peerId);
      return call;
    } else {
      console.error('Failed to call peer:', peerId);
      return null;
    }
  }

  // Answer an incoming call
  answerCall(call: MediaConnection, stream: MediaStream): void {
    if (call && stream) {
      call.answer(stream);
      console.log('Answered call from peer:', call.peer);
    } else {
      console.error('Cannot answer call: Call or stream is missing.');
    }
  }

  // Listen for incoming calls
  onCall(callback: (call: MediaConnection) => void): void {
    this.peer.on('call', callback);
  }

  disconnect() {

  }
}
