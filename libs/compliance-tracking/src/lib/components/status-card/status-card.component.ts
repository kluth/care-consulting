import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { EducationTrackingService } from '../../services/education-tracking.service';
import {
  ComplianceStatusResult,
  CareRole,
  CARE_ROLE_I18N_KEYS,
  STATUS_I18N_KEYS,
} from '../../models/education-tracking.model';

@Component({
  selector: 'cc-education-status-card',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div
      class="status-card"
      [class.at-risk]="isAtRisk()"
      [class.compliant]="isCompliant()"
      [class.non-compliant]="isNonCompliant()"
      *transloco="let t; prefix: 'education'"
    >
      @if (loading()) {
        <div class="loading" aria-live="polite">
          <span class="spinner" aria-hidden="true"></span>
          {{ t('status.loading') }}
        </div>
      } @else if (error()) {
        <div class="error" role="alert">
          <span class="error-icon" aria-hidden="true"></span>
          {{ error() }}
          <button (click)="reload()" class="retry-btn">
            {{ t('common.retry') }}
          </button>
        </div>
      } @else if (status()) {
        <header class="card-header">
          <h2>{{ t('status.myEducation') }}</h2>
          <span class="status-badge" [class]="status()?.status?.toLowerCase()">
            {{ t(statusI18nKey()) }}
          </span>
        </header>

        <div class="card-body">
          <!-- Main progress -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="hours-completed">
                {{ status()?.completedHours | number: '1.0-1' }}h
              </span>
              <span class="hours-divider">/</span>
              <span class="hours-required">
                {{ status()?.requiredHours | number: '1.0-1' }}h
              </span>
            </div>

            <div
              class="progress-bar"
              role="progressbar"
              [attr.aria-valuenow]="status()?.percentComplete"
              aria-valuemin="0"
              aria-valuemax="100"
              [attr.aria-label]="
                t('status.progressLabel', {
                  completed: status()?.completedHours,
                  required: status()?.requiredHours,
                  percent: status()?.percentComplete
                })
              "
            >
              <div
                class="progress-fill"
                [style.width.%]="status()?.percentComplete"
              ></div>
            </div>

            <div class="progress-footer">
              <span>{{ t(careRoleI18nKey()) }}</span>
              <span>{{ status()?.percentComplete | number: '1.0-0' }}%</span>
            </div>
          </div>

          <!-- Pedagogical hours (for Praxisanleiter) -->
          @if (showPedagogicalProgress()) {
            <div class="progress-section pedagogical">
              <div class="progress-header">
                <span class="label">{{ t('status.pedagogicalHours') }}</span>
                <span class="hours">
                  {{ status()?.completedPedagogicalHours | number: '1.0-1' }}h /
                  {{ status()?.requiredPedagogicalHours | number: '1.0-1' }}h
                </span>
              </div>
              <div class="progress-bar small">
                <div
                  class="progress-fill"
                  [style.width.%]="pedagogicalPercent()"
                ></div>
              </div>
            </div>
          }

          <!-- Warning for at-risk -->
          @if (isAtRisk()) {
            <div class="warning-banner" role="alert">
              <span class="warning-icon" aria-hidden="true"></span>
              <span>
                {{ t('status.deadlineWarning', { days: status()?.daysRemaining }) }}
              </span>
            </div>
          }

          <!-- Deadline info -->
          <div class="deadline-info">
            <span class="label">{{ t('status.timeRemaining') }}:</span>
            <span class="value">
              {{ t('status.daysValue', { days: status()?.daysRemaining }) }}
            </span>
          </div>

          <!-- Remaining hours -->
          <div class="remaining-info">
            <span class="label">{{ t('status.stillRequired') }}:</span>
            <span class="value">
              {{ t('status.hoursValue', { hours: status()?.remainingHours }) }}
            </span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .status-card {
      background: var(--cc-surface, #fff);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--cc-border, #e5e7eb);

      &.at-risk {
        border-color: var(--cc-warning, #f59e0b);
        background: linear-gradient(
          135deg,
          rgba(245, 158, 11, 0.05) 0%,
          transparent 100%
        );
      }

      &.compliant {
        border-color: var(--cc-success, #10b981);
      }

      &.non-compliant {
        border-color: var(--cc-error, #ef4444);
        background: linear-gradient(
          135deg,
          rgba(239, 68, 68, 0.05) 0%,
          transparent 100%
        );
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--cc-text, #111827);
      }
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;

      &.in_progress {
        background: var(--cc-info-bg, #dbeafe);
        color: var(--cc-info, #2563eb);
      }

      &.compliant {
        background: var(--cc-success-bg, #d1fae5);
        color: var(--cc-success, #059669);
      }

      &.at_risk {
        background: var(--cc-warning-bg, #fef3c7);
        color: var(--cc-warning, #d97706);
      }

      &.non_compliant {
        background: var(--cc-error-bg, #fee2e2);
        color: var(--cc-error, #dc2626);
      }
    }

    .progress-section {
      margin-bottom: 1.5rem;

      &.pedagogical {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px dashed var(--cc-border, #e5e7eb);
      }
    }

    .progress-header {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      margin-bottom: 0.5rem;

      .hours-completed {
        font-size: 2rem;
        font-weight: 700;
        color: var(--cc-primary, #3b82f6);
      }

      .hours-divider {
        font-size: 1.5rem;
        color: var(--cc-text-muted, #6b7280);
      }

      .hours-required {
        font-size: 1.25rem;
        color: var(--cc-text-muted, #6b7280);
      }

      .label {
        font-size: 0.875rem;
        color: var(--cc-text-muted, #6b7280);
      }

      .hours {
        margin-left: auto;
        font-weight: 600;
        color: var(--cc-text, #111827);
      }
    }

    .progress-bar {
      height: 12px;
      background: var(--cc-progress-bg, #e5e7eb);
      border-radius: 6px;
      overflow: hidden;

      &.small {
        height: 8px;
      }

      .progress-fill {
        height: 100%;
        background: var(--cc-primary, #3b82f6);
        border-radius: 6px;
        transition: width 0.3s ease;
      }
    }

    .progress-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--cc-text-muted, #6b7280);
    }

    .warning-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--cc-warning-bg, #fef3c7);
      border-radius: 8px;
      margin-bottom: 1rem;
      color: var(--cc-warning-text, #92400e);
      font-size: 0.875rem;

      .warning-icon {
        font-size: 1.25rem;
      }
    }

    .deadline-info,
    .remaining-info {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.875rem;

      .label {
        color: var(--cc-text-muted, #6b7280);
      }

      .value {
        font-weight: 600;
        color: var(--cc-text, #111827);
      }
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
      color: var(--cc-text-muted, #6b7280);

      .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--cc-border, #e5e7eb);
        border-top-color: var(--cc-primary, #3b82f6);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 2rem;
      color: var(--cc-error, #ef4444);
      text-align: center;

      .retry-btn {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--cc-primary, #3b82f6);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
          opacity: 0.9;
        }
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class StatusCardComponent implements OnInit {
  private readonly educationService = inject(EducationTrackingService);

  // Inputs
  readonly careRole = input<CareRole>();

  // State from service
  readonly status = signal<ComplianceStatusResult | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Computed values
  readonly statusI18nKey = computed(() => {
    const s = this.status();
    return s ? STATUS_I18N_KEYS[s.status] : '';
  });

  readonly careRoleI18nKey = computed(() => {
    const role = this.careRole();
    return role ? CARE_ROLE_I18N_KEYS[role] : '';
  });

  readonly showPedagogicalProgress = computed(() => {
    const s = this.status();
    return s && s.requiredPedagogicalHours > 0;
  });

  readonly pedagogicalPercent = computed(() => {
    const s = this.status();
    if (!s || s.requiredPedagogicalHours === 0) return 0;
    return Math.min(
      100,
      (s.completedPedagogicalHours / s.requiredPedagogicalHours) * 100
    );
  });

  ngOnInit(): void {
    this.loadStatus();
  }

  private loadStatus(): void {
    this.loading.set(true);
    this.error.set(null);

    this.educationService.getComplianceStatus().subscribe({
      next: (status) => {
        this.status.set(status);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load status');
        this.loading.set(false);
      },
    });
  }

  reload(): void {
    this.loadStatus();
  }

  isAtRisk(): boolean {
    return this.status()?.status === 'AT_RISK';
  }

  isCompliant(): boolean {
    return this.status()?.status === 'COMPLIANT';
  }

  isNonCompliant(): boolean {
    return this.status()?.status === 'NON_COMPLIANT';
  }
}
