import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WellnessCheckInComponent } from './wellness-check-in.component';
import { BreathingExerciseComponent } from './breathing-exercise.component';

@Component({
  selector: 'app-wellness-dashboard',
  standalone: true,
  imports: [CommonModule, WellnessCheckInComponent, BreathingExerciseComponent],
  template: `
    <div class="dashboard-container">
      <header>
        <h1>Wellness & Burnout Prävention</h1>
        <p>Nimm dir einen Moment Zeit für dich.</p>
      </header>
      
      <div class="dashboard-grid">
        <section class="card-section">
          <app-wellness-check-in></app-wellness-check-in>
        </section>
        
        <section class="card-section">
          <app-breathing-exercise></app-breathing-exercise>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 3rem;
      text-align: center;
    }
    header h1 {
      color: #0d9488;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      align-items: start;
    }
    @media (max-width: 600px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WellnessDashboardComponent {}
