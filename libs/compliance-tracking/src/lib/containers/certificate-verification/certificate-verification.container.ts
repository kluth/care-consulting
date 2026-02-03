import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { EducationTrackingService } from '../../services/education-tracking.service';
import {
  CertificateVerificationResult,
  CARE_ROLE_I18N_KEYS,
  CareRole,
} from '../../models/education-tracking.model';

@Component({
  selector: 'cc-certificate-verification',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="verification-page" *transloco="let t; prefix: 'education'">
      <div class="verification-card">
        <header class="card-header">
          <img
            src="/assets/logo.svg"
            alt="Care Consulting"
            class="logo"
            width="120"
          />
          <h1>{{ t('verify.title') }}</h1>
        </header>

        @if (loading()) {
          <div class="loading" aria-live="polite">
            <span class="spinner" aria-hidden="true"></span>
            {{ t('verify.checking') }}
          </div>
        } @else if (result()) {
          @if (result()?.valid) {
            <div class="result valid" role="status">
              <div class="status-icon valid" aria-hidden="true">✓</div>
              <h2>{{ t('verify.valid') }}</h2>

              <div class="certificate-details">
                <div class="detail-row">
                  <span class="label">{{ t('verify.name') }}:</span>
                  <span class="value">{{
                    result()?.certificate?.user?.name
                  }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">{{ t('verify.role') }}:</span>
                  <span class="value">{{
                    t(getCareRoleI18nKey(result()?.certificate?.period?.careRole))
                  }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">{{ t('verify.period') }}:</span>
                  <span class="value">
                    {{
                      result()?.certificate?.period?.startDate
                        | date: 'dd.MM.yyyy'
                    }}
                    -
                    {{
                      result()?.certificate?.period?.endDate | date: 'dd.MM.yyyy'
                    }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">{{ t('verify.hours') }}:</span>
                  <span class="value">
                    {{ t('verify.hoursValue', { hours: result()?.certificate?.totalHours }) }}
                  </span>
                </div>
                @if ((result()?.certificate?.pedagogicalHours ?? 0) > 0) {
                  <div class="detail-row">
                    <span class="label">{{ t('verify.pedagogicalHours') }}:</span>
                    <span class="value">
                      {{ t('verify.hoursValue', { hours: result()?.certificate?.pedagogicalHours }) }}
                    </span>
                  </div>
                }
                <div class="detail-row">
                  <span class="label">{{ t('verify.issuedAt') }}:</span>
                  <span class="value">
                    {{ result()?.certificate?.issuedAt | date: 'dd.MM.yyyy' }}
                  </span>
                </div>
              </div>

              <div class="verification-badge">
                <span class="badge-icon" aria-hidden="true">🔒</span>
                <span>{{ t('verify.cryptographicallyVerified') }}</span>
              </div>
            </div>
          } @else {
            <div class="result invalid" role="alert">
              <div class="status-icon invalid" aria-hidden="true">✗</div>
              <h2>{{ t('verify.invalid') }}</h2>
              <p class="error-message">{{ result()?.error }}</p>
            </div>
          }
        }

        <footer class="card-footer">
          <p>
            {{ t('verify.footerText') }}
            <br />
            {{ t('verify.contactInfo') }}
            <a href="mailto:support@care-consulting.de"
              >support&#64;care-consulting.de</a
            >
          </p>
        </footer>
      </div>
    </div>
  `,
  styles: `
    .verification-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(
        135deg,
        var(--cc-primary-light, #dbeafe) 0%,
        var(--cc-surface, #fff) 100%
      );
    }

    .verification-card {
      background: var(--cc-surface, #fff);
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      text-align: center;
      margin-bottom: 2rem;

      .logo {
        margin-bottom: 1rem;
      }

      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--cc-text, #111827);
      }
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      color: var(--cc-text-muted, #6b7280);

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--cc-border, #e5e7eb);
        border-top-color: var(--cc-primary, #3b82f6);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    .result {
      text-align: center;
      padding: 2rem 0;

      h2 {
        margin: 1rem 0;
        font-size: 1.5rem;
      }

      &.valid {
        h2 {
          color: var(--cc-success, #059669);
        }
      }

      &.invalid {
        h2 {
          color: var(--cc-error, #dc2626);
        }
      }
    }

    .status-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: bold;

      &.valid {
        background: var(--cc-success-bg, #d1fae5);
        color: var(--cc-success, #059669);
      }

      &.invalid {
        background: var(--cc-error-bg, #fee2e2);
        color: var(--cc-error, #dc2626);
      }
    }

    .certificate-details {
      text-align: left;
      background: var(--cc-surface-alt, #f9fafb);
      border-radius: 8px;
      padding: 1rem;
      margin: 1.5rem 0;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--cc-border, #e5e7eb);

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: var(--cc-text-muted, #6b7280);
        font-size: 0.875rem;
      }

      .value {
        font-weight: 500;
        color: var(--cc-text, #111827);
      }
    }

    .verification-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--cc-success-bg, #d1fae5);
      color: var(--cc-success, #059669);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .error-message {
      color: var(--cc-text-muted, #6b7280);
      margin-top: 0.5rem;
    }

    .card-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--cc-border, #e5e7eb);

      p {
        margin: 0;
        font-size: 0.75rem;
        color: var(--cc-text-muted, #6b7280);
        line-height: 1.5;
      }

      a {
        color: var(--cc-primary, #3b82f6);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
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
export class CertificateVerificationContainer implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly educationService = inject(EducationTrackingService);

  readonly loading = signal(true);
  readonly result = signal<CertificateVerificationResult | null>(null);

  ngOnInit(): void {
    const shortId = this.route.snapshot.paramMap.get('shortId');
    if (shortId) {
      this.verifyCertificate(shortId);
    } else {
      this.loading.set(false);
      this.result.set({ valid: false, error: 'No certificate ID provided' });
    }
  }

  private verifyCertificate(shortId: string): void {
    this.educationService.verifyCertificate(shortId).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: (err) => {
        this.result.set({
          valid: false,
          error: err.message || 'Verification failed',
        });
        this.loading.set(false);
      },
    });
  }

  getCareRoleI18nKey(role: CareRole | string | undefined): string {
    if (!role) return '';
    return CARE_ROLE_I18N_KEYS[role as CareRole] || role;
  }
}
