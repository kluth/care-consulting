import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-breathing-exercise',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exercise-container">
      <h3>Atemübung: 4-4-4-4 (Box Breathing)</h3>
      <p class="phase-text">{{ phase() }}</p>
      
      <div class="circle-container">
        <div class="breathing-circle" [@circleState]="animationState()"></div>
      </div>

      <div class="controls">
        @if (!active()) {
          <button (click)="start()">Starten</button>
        } @else {
          <button (click)="stop()">Stop</button>
        }
      </div>
      
      <p class="instruction">Einatmen (4s) - Halten (4s) - Ausatmen (4s) - Halten (4s)</p>
    </div>
  `,
  styles: [`
    .exercise-container {
      text-align: center;
      padding: 2rem;
      background: #f0fdfa;
      border-radius: 16px;
      max-width: 400px;
      margin: 2rem auto;
    }
    .phase-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: #0d9488;
      height: 2rem;
    }
    .circle-container {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0;
    }
    .breathing-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #2dd4bf;
      box-shadow: 0 0 20px rgba(45, 212, 191, 0.5);
    }
    .controls button {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      border: none;
      background: #0d9488;
      color: white;
      cursor: pointer;
      font-weight: bold;
    }
    .instruction {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: #666;
    }
  `],
  animations: [
    trigger('circleState', [
      state('inhale', style({ transform: 'scale(2)', opacity: 1 })),
      state('hold-inhale', style({ transform: 'scale(2)', opacity: 0.8 })),
      state('exhale', style({ transform: 'scale(1)', opacity: 0.6 })),
      state('hold-exhale', style({ transform: 'scale(1)', opacity: 0.4 })),
      transition('* => inhale', animate('4000ms ease-in-out')),
      transition('* => hold-inhale', animate('4000ms linear')),
      transition('* => exhale', animate('4000ms ease-in-out')),
      transition('* => hold-exhale', animate('4000ms linear')),
    ])
  ]
})
export class BreathingExerciseComponent {
  phase = signal<string>('Bereit?');
  animationState = signal<string>('hold-exhale');
  active = signal<boolean>(false);
  private timer: any;

  start() {
    this.active.set(true);
    this.runCycle();
  }

  stop() {
    this.active.set(false);
    this.phase.set('Bereit?');
    this.animationState.set('hold-exhale');
    clearTimeout(this.timer);
  }

  private runCycle() {
    if (!this.active()) return;

    // Phase 1: Inhale
    this.phase.set('Einatmen...');
    this.animationState.set('inhale');
    
    this.timer = setTimeout(() => {
      if (!this.active()) return;
      // Phase 2: Hold
      this.phase.set('Anhalten...');
      this.animationState.set('hold-inhale');
      
      this.timer = setTimeout(() => {
        if (!this.active()) return;
        // Phase 3: Exhale
        this.phase.set('Ausatmen...');
        this.animationState.set('exhale');
        
        this.timer = setTimeout(() => {
          if (!this.active()) return;
          // Phase 4: Hold
          this.phase.set('Anhalten...');
          this.animationState.set('hold-exhale');
          
          this.timer = setTimeout(() => {
            this.runCycle();
          }, 4000);
        }, 4000);
      }, 4000);
    }, 4000);
  }
}
