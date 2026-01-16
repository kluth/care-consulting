import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // In production, this URL should be dynamic/environment based
    this.socket = io('http://localhost:3000'); 
  }

  joinRoom(courseId: string) {
    this.socket.emit('joinRoom', courseId);
  }

  sendMessage(courseId: string, message: string, sender: string) {
    this.socket.emit('sendMessage', { courseId, message, sender });
  }

  getMessages(): Observable<{ sender: string; message: string; timestamp: Date }> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (msg) => {
        observer.next(msg);
      });
    });
  }
}