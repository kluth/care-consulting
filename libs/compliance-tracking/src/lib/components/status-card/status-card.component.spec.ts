import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

import { StatusCardComponent } from './status-card.component';
import { FortbildungService } from '../../services/fortbildung.service';
import { ComplianceStatusResult } from '../../models/fortbildung.model';

describe('StatusCardComponent', () => {
  let component: StatusCardComponent;
  let fixture: ComponentFixture<StatusCardComponent>;
  let mockFortbildungService: jest.Mocked<Partial<FortbildungService>>;

  const mockComplianceStatus: ComplianceStatusResult = {
    status: 'IN_PROGRESS',
    completedHours: 8,
    requiredHours: 16,
    completedPedagogicalHours: 0,
    requiredPedagogicalHours: 0,
    remainingHours: 8,
    remainingPedagogicalHours: 0,
    daysRemaining: 180,
    percentComplete: 50,
  };

  beforeEach(async () => {
    mockFortbildungService = {
      getComplianceStatus: jest.fn().mockReturnValue(of(mockComplianceStatus)),
    };

    await TestBed.configureTestingModule({
      imports: [StatusCardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: FortbildungService, useValue: mockFortbildungService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusCardComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should have default loading state', () => {
      expect(component.loading()).toBe(true);
    });

    it('should load status on init', () => {
      fixture.detectChanges();
      expect(mockFortbildungService.getComplianceStatus).toHaveBeenCalled();
    });
  });

  describe('display', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display progress bar correctly', () => {
      const progressBar = fixture.nativeElement.querySelector('.progress-bar');
      expect(progressBar).toBeTruthy();

      const progressFill =
        fixture.nativeElement.querySelector('.progress-fill');
      expect(progressFill.style.width).toBe('50%');
    });

    it('should show completed vs required hours', () => {
      const completedHours = fixture.nativeElement.querySelector(
        '.hours-completed'
      );
      const requiredHours =
        fixture.nativeElement.querySelector('.hours-required');

      expect(completedHours.textContent).toContain('8');
      expect(requiredHours.textContent).toContain('16');
    });

    it('should show percentage complete', () => {
      const footer = fixture.nativeElement.querySelector('.progress-footer');
      expect(footer.textContent).toContain('50%');
    });

    it('should show days remaining', () => {
      const deadlineInfo =
        fixture.nativeElement.querySelector('.deadline-info');
      expect(deadlineInfo.textContent).toContain('180');
    });
  });

  describe('warning for <30 days remaining', () => {
    it('should show warning indicator when at risk', async () => {
      const atRiskStatus: ComplianceStatusResult = {
        ...mockComplianceStatus,
        status: 'AT_RISK',
        daysRemaining: 25,
      };
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(of(atRiskStatus));

      fixture = TestBed.createComponent(StatusCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      await fixture.whenStable();

      const warningBanner =
        fixture.nativeElement.querySelector('.warning-banner');
      expect(warningBanner).toBeTruthy();
      expect(warningBanner.textContent).toContain('25 Tage');
    });

    it('should not show warning when not at risk', () => {
      fixture.detectChanges();

      const warningBanner =
        fixture.nativeElement.querySelector('.warning-banner');
      expect(warningBanner).toBeFalsy();
    });
  });

  describe('different requirements based on role', () => {
    it('should show pedagogical progress for Praxisanleiter', async () => {
      const praxisanleiterStatus: ComplianceStatusResult = {
        status: 'IN_PROGRESS',
        completedHours: 20,
        requiredHours: 24,
        completedPedagogicalHours: 8,
        requiredPedagogicalHours: 12,
        remainingHours: 4,
        remainingPedagogicalHours: 4,
        daysRemaining: 200,
        percentComplete: 83,
      };
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(of(praxisanleiterStatus));

      fixture = TestBed.createComponent(StatusCardComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('careRole', 'PRAXISANLEITER');
      fixture.detectChanges();

      await fixture.whenStable();

      const pedagogicalSection = fixture.nativeElement.querySelector(
        '.progress-section.pedagogical'
      );
      expect(pedagogicalSection).toBeTruthy();
      expect(pedagogicalSection.textContent).toContain('8');
      expect(pedagogicalSection.textContent).toContain('12');
    });

    it('should not show pedagogical progress for Pflegefachkraft', () => {
      fixture.componentRef.setInput('careRole', 'PFLEGEFACHKRAFT');
      fixture.detectChanges();

      const pedagogicalSection = fixture.nativeElement.querySelector(
        '.progress-section.pedagogical'
      );
      expect(pedagogicalSection).toBeFalsy();
    });
  });

  describe('loading and error states', () => {
    it('should show loading indicator', () => {
      component.loading.set(true);
      component.status.set(null);
      fixture.detectChanges();

      const loading = fixture.nativeElement.querySelector('.loading');
      expect(loading).toBeTruthy();
      expect(loading.textContent).toContain('Lade Status');
    });

    it('should show error state with retry button', async () => {
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Network error')));

      fixture = TestBed.createComponent(StatusCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      await fixture.whenStable();

      const error = fixture.nativeElement.querySelector('.error');
      expect(error).toBeTruthy();

      const retryBtn = fixture.nativeElement.querySelector('.retry-btn');
      expect(retryBtn).toBeTruthy();
    });

    it('should reload on retry button click', async () => {
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Network error')));

      fixture = TestBed.createComponent(StatusCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      await fixture.whenStable();

      // Reset mock to succeed
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(of(mockComplianceStatus));

      const retryBtn = fixture.nativeElement.querySelector('.retry-btn');
      retryBtn.click();
      fixture.detectChanges();

      expect(mockFortbildungService.getComplianceStatus).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have correct ARIA attributes on progress bar', () => {
      const progressBar = fixture.nativeElement.querySelector('.progress-bar');
      expect(progressBar.getAttribute('role')).toBe('progressbar');
      expect(progressBar.getAttribute('aria-valuenow')).toBe('50');
      expect(progressBar.getAttribute('aria-valuemin')).toBe('0');
      expect(progressBar.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should have aria-label on card', () => {
      const card = fixture.nativeElement.querySelector('.status-card');
      expect(card.getAttribute('aria-label')).toContain('Fortbildungsstatus');
    });

    it('should have aria-live on loading state', () => {
      component.loading.set(true);
      component.status.set(null);
      fixture.detectChanges();

      const loading = fixture.nativeElement.querySelector('.loading');
      expect(loading.getAttribute('aria-live')).toBe('polite');
    });

    it('should have role=alert on error state', async () => {
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Error')));

      fixture = TestBed.createComponent(StatusCardComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const error = fixture.nativeElement.querySelector('.error');
      expect(error.getAttribute('role')).toBe('alert');
    });

    it('should have role=alert on warning banner', async () => {
      const atRiskStatus: ComplianceStatusResult = {
        ...mockComplianceStatus,
        status: 'AT_RISK',
        daysRemaining: 20,
      };
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(of(atRiskStatus));

      fixture = TestBed.createComponent(StatusCardComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const warning = fixture.nativeElement.querySelector('.warning-banner');
      expect(warning.getAttribute('role')).toBe('alert');
    });
  });

  describe('status styling', () => {
    it('should add compliant class when status is COMPLIANT', async () => {
      const compliantStatus: ComplianceStatusResult = {
        ...mockComplianceStatus,
        status: 'COMPLIANT',
      };
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(of(compliantStatus));

      fixture = TestBed.createComponent(StatusCardComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const card = fixture.nativeElement.querySelector('.status-card');
      expect(card.classList.contains('compliant')).toBe(true);
    });

    it('should add at-risk class when status is AT_RISK', async () => {
      const atRiskStatus: ComplianceStatusResult = {
        ...mockComplianceStatus,
        status: 'AT_RISK',
      };
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(of(atRiskStatus));

      fixture = TestBed.createComponent(StatusCardComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const card = fixture.nativeElement.querySelector('.status-card');
      expect(card.classList.contains('at-risk')).toBe(true);
    });

    it('should add non-compliant class when status is NON_COMPLIANT', async () => {
      const nonCompliantStatus: ComplianceStatusResult = {
        ...mockComplianceStatus,
        status: 'NON_COMPLIANT',
      };
      mockFortbildungService.getComplianceStatus = jest
        .fn()
        .mockReturnValue(of(nonCompliantStatus));

      fixture = TestBed.createComponent(StatusCardComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const card = fixture.nativeElement.querySelector('.status-card');
      expect(card.classList.contains('non-compliant')).toBe(true);
    });
  });
});
