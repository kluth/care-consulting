import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService, AuditRun } from '../../services/audit.service';
import { UiButtonComponent } from '@care-consulting/ui';

@Component({
  selector: 'audit-wizard',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    @if (auditRun(); as run) {
      <div class="audit-wizard">
        <header>
          <h1>{{ run.template.title }}</h1>
          <div class="progress">
            Section {{ currentSectionIndex() + 1 }} / {{ run.template.sections.length }}
          </div>
        </header>

        <section class="question-area">
          @if (currentSection(); as section) {
            <h2>{{ section.title }}</h2>
            
            <div class="questions-list">
              @for (question of section.questions; track question.id) {
                <div class="question-card">
                  <p>{{ question.text }}</p>
                  <div class="actions">
                    <button 
                      class="btn-answer yes" 
                      [class.active]="getAnswer(question.id) === 'YES'"
                      (click)="answerQuestion(question.id, 'YES')"
                    >Ja</button>
                    <button 
                      class="btn-answer no" 
                      [class.active]="getAnswer(question.id) === 'NO'"
                      (click)="answerQuestion(question.id, 'NO')"
                    >Nein</button>
                    <button 
                      class="btn-answer na" 
                      [class.active]="getAnswer(question.id) === 'NOT_APPLICABLE'"
                      (click)="answerQuestion(question.id, 'NOT_APPLICABLE')"
                    >N/A</button>
                  </div>
                </div>
              }
            </div>

            <div class="navigation">
              <ui-button 
                [disabled]="currentSectionIndex() === 0"
                (click)="prevSection()"
              >Zurück</ui-button>
              
              <ui-button 
                [disabled]="currentSectionIndex() === run.template.sections.length - 1"
                (click)="nextSection()"
              >Weiter</ui-button>
            </div>
          }
        </section>
      </div>
    } @else {
      <p>Lade Audit...</p>
    }
  `,
  styles: [`
    .audit-wizard {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .question-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .btn-answer {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      cursor: pointer;
      background: white;
    }
    .btn-answer.yes.active { background: #c6f6d5; border-color: #48bb78; }
    .btn-answer.no.active { background: #fed7d7; border-color: #f56565; }
    .btn-answer.na.active { background: #e2e8f0; border-color: #a0aec0; }
    
    .navigation {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }
  `]
})
export class AuditWizardComponent {
  runId = input.required<string>();
  
  private auditService = inject(AuditService);
  
  auditRun = signal<AuditRun | null>(null);
  currentSectionIndex = signal(0);
  answers = signal<Map<string, string>>(new Map());

  constructor() {
    effect(() => {
      this.loadRun(this.runId());
    });
  }

  loadRun(id: string) {
    this.auditService.getRun(id).subscribe(run => {
      this.auditRun.set(run);
      // Hydrate answers map
      const map = new Map();
      run.answers.forEach(a => map.set(a.questionId, a.value));
      this.answers.set(map);
    });
  }

  get currentSection() {
    return this.auditRun()?.template.sections[this.currentSectionIndex()];
  }

  getAnswer(questionId: string) {
    return this.answers().get(questionId);
  }

  answerQuestion(questionId: string, value: string) {
    // Optimistic update
    this.answers.update(map => new Map(map).set(questionId, value));
    
    this.auditService.saveAnswer(this.runId(), questionId, value).subscribe();
  }

  nextSection() {
    this.currentSectionIndex.update(i => i + 1);
    window.scrollTo(0, 0);
  }

  prevSection() {
    this.currentSectionIndex.update(i => i - 1);
    window.scrollTo(0, 0);
  }
}
