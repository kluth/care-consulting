import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditWizardComponent } from './audit-wizard.component';
import { AuditService } from '../../services/audit.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('AuditWizardComponent', () => {
  let component: AuditWizardComponent;
  let fixture: ComponentFixture<AuditWizardComponent>;
  let auditServiceMock: any;

  beforeEach(async () => {
    auditServiceMock = {
      getRun: vi.fn().mockReturnValue(of({ 
        id: 'run_1',
        template: {
          sections: [
            { id: 's1', title: 'Section 1', questions: [{ id: 'q1', text: 'Q1' }] }
          ]
        },
        answers: []
      })),
      saveAnswer: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [AuditWizardComponent],
      providers: [
        { provide: AuditService, useValue: auditServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditWizardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('runId', 'run_1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load audit run', () => {
    expect(auditServiceMock.getRun).toHaveBeenCalledWith('run_1');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Section 1');
  });

  it('should save answer when clicked', () => {
    // Simulate answering logic
    component.answerQuestion('q1', 'YES');
    expect(auditServiceMock.saveAnswer).toHaveBeenCalledWith('run_1', 'q1', 'YES');
  });
});
