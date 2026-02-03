import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-burnout-assessment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="assessment-container">
      <h2>Burnout-Risiko Check (CBI)</h2>
      
      @if (!started()) {
        <div class="intro">
          <p>Dieses Quartals-Assessment hilft dir, dein persönliches Burnout-Risiko besser zu verstehen.</p>
          <p>Dauer: ca. 5 Minuten. Deine Daten sind privat.</p>
          <button class="primary-btn" (click)="started.set(true)">Jetzt starten</button>
        </div>
      } @else if (!completed()) {
        <div class="question-flow">
          <div class="progress-bar">
            <div class="progress" [style.width.%]="(currentStep() / questions.length) * 100"></div>
          </div>
          
          <p class="question-text">{{ questions[currentStep()].text }}</p>
          
          <div class="options">
            @for (opt of options; track opt.value) {
              <button (click)="answer(opt.value)">{{ opt.label }}</button>
            }
          </div>
        </div>
      } @else {
        <div class="result">
          <h3>Danke für deine Teilnahme!</h3>
          <p>Dein Assessment wurde gespeichert. Deine Ergebnisse fließen in dein persönliches Dashboard ein.</p>
          <button class="primary-btn" (click)="reset()">Zurück zum Dashboard</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .assessment-container { padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .progress-bar { height: 8px; background: #f3f4f6; border-radius: 4px; margin-bottom: 2rem; overflow: hidden; }
    .progress { height: 100%; background: #0d9488; transition: width 0.3s ease; }
    .question-text { font-size: 1.2rem; margin-bottom: 2rem; font-weight: 500; }
    .options { display: grid; gap: 0.5rem; }
    .options button { padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; cursor: pointer; text-align: left; }
    .options button:hover { background: #f0fdfa; border-color: #2dd4bf; }
    .primary-btn { padding: 0.75rem 2rem; background: #0d9488; color: white; border: none; border-radius: 8px; cursor: pointer; }
  `]
})
export class BurnoutAssessmentComponent {
  started = signal(false);
  completed = signal(false);
  currentStep = signal(0);
  
  questions = [
    { id: 1, text: 'Wie oft fühlst du dich körperlich erschöpft?' },
    { id: 2, text: 'Wie oft fühlst du dich emotional ausgelaugt?' },
    { id: 3, text: 'Hattest du heute schon Fika?' } // Ein kleiner Brainy-Special
  ];

  options = [
    { label: 'Immer', value: 100 },
    { label: 'Oft', value: 75 },
    { label: 'Manchmal', value: 50 },
    { label: 'Selten', value: 25 },
    { label: 'Nie', value: 0 }
  ];

  answer(val: number) {
    if (this.currentStep() < this.questions.length - 1) {
      this.currentStep.update(s => s + 1);
    } else {
      this.completed.set(true);
    }
  }

  reset() {
    this.started.set(false);
    this.completed.set(false);
    this.currentStep.set(0);
  }
}
