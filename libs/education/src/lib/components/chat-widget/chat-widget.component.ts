import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { UiButtonComponent, UiInputComponent } from '@care-consulting/ui';

@Component({
  selector: 'education-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiInputComponent],
  template: `
    <div class="chat-widget">
      <div class="messages">
        @for (msg of messages(); track $index) {
          <div class="message">
            <strong>{{ msg.sender }}:</strong> {{ msg.message }}
          </div>
        }
      </div>
      <div class="input-area">
        <ui-input
          [(ngModel)]="newMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Type a message..."
        />
        <ui-button (click)="sendMessage()">Send</ui-button>
      </div>
    </div>
  `,
  styles: [`
    .chat-widget {
      border: 1px solid #ddd;
      border-radius: 4px;
      height: 400px;
      display: flex;
      flex-direction: column;
    }
    .messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    .input-area {
      padding: 0.5rem;
      border-top: 1px solid #ddd;
      display: flex;
      gap: 0.5rem;
    }
    input {
      flex: 1;
      padding: 0.5rem;
    }
  `]
})
export class ChatWidgetComponent {
  courseId = input.required<string>();
  username = input.required<string>(); // In real app, get from AuthService

  private chatService = inject(ChatService);
  messages = signal<{ sender: string; message: string; timestamp: Date }[]>([]);
  newMessage = '';

  constructor() {
    effect(() => {
      this.chatService.joinRoom(this.courseId());
    });

    this.chatService.getMessages().subscribe((msg) => {
      this.messages.update((msgs) => [...msgs, msg]);
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.chatService.sendMessage(this.courseId(), this.newMessage, this.username());
    this.newMessage = '';
  }
}
