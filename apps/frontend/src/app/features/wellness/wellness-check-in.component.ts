import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WellnessService } from './wellness.service';

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
    button.submit-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  `]
})
export class WellnessCheckInComponent {
  private wellnessService = inject(WellnessService);
  
  mood = signal<number>(3);
  stress = signal<number>(3);
  note = signal<string>('');
  submitted = signal<boolean>(false);
  loading = signal<boolean>(false);

  setMood(val: number) { this.mood.set(val); }
  setStress(val: number) { this.stress.set(val); }

  submit() {
    this.loading.set(true);
    this.wellnessService.createCheckIn({
      mood: this.mood(),
      stress: this.stress(),
      note: this.note()
    }).subscribe({
      next: () => {
        this.submitted.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Check-in failed', err);
        this.loading.set(false);
      }
    });
  }
}
