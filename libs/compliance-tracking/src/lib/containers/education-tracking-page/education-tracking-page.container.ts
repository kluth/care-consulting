import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { StatusCardComponent } from '../../components/status-card/status-card.component';
import { TrainingFormComponent } from '../../components/training-form/training-form.component';
import { EducationTrackingService } from '../../services/education-tracking.service';
import { EducationEntry } from '../../models/education-tracking.model';

@Component({
  selector: 'cc-education-tracking-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    StatusCardComponent,
    TrainingFormComponent,
  ],
  template: `
    <div class="education-tracking-page" *transloco="let t; prefix: 'education'">
      <header class="page-header">
        <h1>{{ t('page.title') }}</h1>
        <p class="subtitle">{{ t('page.subtitle') }}</p>
      </header>

      <div class="page-content">
        <!-- Status Card -->
        <section class="status-section" aria-labelledby="status-heading">
          <h2 id="status-heading" class="section-title">
            {{ t('status.title') }}
          </h2>
          <cc-education-status-card />
        </section>

        <!-- Training Form -->
        <section class="form-section" aria-labelledby="form-heading">
          <h2 id="form-heading" class="section-title">
            {{ t('form.addExternal') }}
          </h2>
          <cc-training-form (entryCreated)="onEntryCreated($event)" />
        </section>

        <!-- Training History -->
        <section class="history-section" aria-labelledby="history-heading">
          <h2 id="history-heading" class="section-title">
            {{ t('history.title') }}
          </h2>

          @if (loading()) {
            <div class="loading">{{ t('common.loading') }}</div>
          } @else if (entries().length === 0) {
            <div class="empty-state">
              <p>{{ t('history.empty') }}</p>
            </div>
          } @else {
            <ul class="entries-list" role="list">
              @for (entry of entries(); track entry.id) {
                <li class="entry-item">
                  <div class="entry-header">
                    <span class="entry-title">{{ entry.title }}</span>
                    <span class="entry-hours">{{ entry.hours }}h</span>
                  </div>
                  <div class="entry-meta">
                    <span class="entry-date">
                      {{ entry.trainingDate | date: 'dd.MM.yyyy' }}
                    </span>
                    @if (entry.provider) {
                      <span class="entry-provider">{{ entry.provider }}</span>
                    }
                    <span
                      class="entry-category"
                      [class]="entry.category.toLowerCase()"
                    >
                      {{ t('category.' + entry.category.toLowerCase()) }}
                    </span>
                  </div>
                  @if (entry.isVerified) {
                    <span
                      class="verified-badge"
                      [attr.aria-label]="t('common.verified')"
                    >
                      ✓ {{ t('common.verified') }}
                    </span>
                  }
                </li>
              }
            </ul>
          }
        </section>
      </div>
    </div>
  `,
  styles: `
    .education-tracking-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      margin-bottom: 2rem;

      h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--cc-text, #111827);
      }

      .subtitle {
        margin: 0;
        color: var(--cc-text-muted, #6b7280);
      }
    }

    .section-title {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--cc-text, #111827);
    }

    .status-section,
    .form-section,
    .history-section {
      margin-bottom: 2rem;
    }

    .entries-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .entry-item {
      background: var(--cc-surface, #fff);
      border-radius: 8px;
      padding: 1rem;
      border: 1px solid var(--cc-border, #e5e7eb);
      position: relative;

      &:hover {
        border-color: var(--cc-primary, #3b82f6);
      }
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;

      .entry-title {
        font-weight: 500;
        color: var(--cc-text, #111827);
      }

      .entry-hours {
        font-weight: 600;
        color: var(--cc-primary, #3b82f6);
        background: var(--cc-primary-bg, #dbeafe);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
      }
    }

    .entry-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--cc-text-muted, #6b7280);
      flex-wrap: wrap;
    }

    .entry-category {
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;

      &.fachlich {
        background: var(--cc-info-bg, #dbeafe);
        color: var(--cc-info, #2563eb);
      }

      &.paedagogisch {
        background: var(--cc-success-bg, #d1fae5);
        color: var(--cc-success, #059669);
      }

      &.sonstige {
        background: var(--cc-neutral-bg, #f3f4f6);
        color: var(--cc-text-muted, #6b7280);
      }
    }

    .verified-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 0.75rem;
      color: var(--cc-success, #059669);
    }

    .loading,
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--cc-text-muted, #6b7280);
      background: var(--cc-surface, #fff);
      border-radius: 8px;
      border: 1px solid var(--cc-border, #e5e7eb);
    }
  `,
})
export class EducationTrackingPageContainer implements OnInit {
  private readonly educationService = inject(EducationTrackingService);

  readonly entries = signal<EducationEntry[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadEntries();
  }

  private loadEntries(): void {
    this.loading.set(true);
    this.educationService.getEntries().subscribe({
      next: (entries) => {
        this.entries.set(entries);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onEntryCreated(entry: EducationEntry): void {
    this.entries.update((current) => [entry, ...current]);
  }
}
