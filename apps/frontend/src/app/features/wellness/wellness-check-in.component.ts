import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wellness-check-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wellness-check-in.component.html',
  styles: [`
    .check-in-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      background: white;
    }
    .scale-buttons {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;
    }
    .scale-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #ccc;
      background: #f9f9f9;
      cursor: pointer;
    }
    .scale-btn.selected {
      background: #2dd4bf;
      color: white;
      border-color: #0d9488;
    }
    textarea {
      width: 100%;
      margin-top: 1rem;
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
    button.submit-btn {
      width: 100%;
      margin-top: 1.5rem;
      padding: 0.75rem;
      background: #0d9488;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  `]
})
export class WellnessCheckInComponent {
  mood = signal<number>(3);
  stress = signal<number>(3);
  note = signal<string>('');
  submitted = signal<boolean>(false);

  setMood(val: number) { this.mood.set(val); }
  setStress(val: number) { this.stress.set(val); }

  submit() {
    console.log('Wellness Check-In:', {
      mood: this.mood(),
      stress: this.stress(),
      note: this.note()
    });
    this.submitted.set(true);
  }
}
