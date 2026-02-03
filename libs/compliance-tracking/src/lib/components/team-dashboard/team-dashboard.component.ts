import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { EducationTrackingService } from '../../services/education-tracking.service';
import {
  TeamMemberCompliance,
  TeamComplianceFilters,
  ComplianceStatus,
  CARE_ROLE_I18N_KEYS,
  STATUS_I18N_KEYS,
  CareRole,
} from '../../models/education-tracking.model';

@Component({
  selector: 'cc-team-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="team-dashboard" *transloco="let t; prefix: 'education'">
      <header class="dashboard-header">
        <h1>{{ t('team.title') }}</h1>
        <p class="subtitle">{{ t('team.subtitle') }}</p>
      </header>

      <!-- Filters -->
      <div class="filters" role="search" [attr.aria-label]="t('team.filter')">
        <div class="filter-group">
          <label for="status-filter">{{ t('team.filterStatus') }}</label>
          <select
            id="status-filter"
            [(ngModel)]="statusFilter"
            (ngModelChange)="onFilterChange()"
          >
            <option value="">{{ t('team.filterAll') }}</option>
            <option value="AT_RISK">{{ t('status.atRisk') }}</option>
            <option value="NON_COMPLIANT">{{ t('status.nonCompliant') }}</option>
            <option value="IN_PROGRESS">{{ t('status.inProgress') }}</option>
            <option value="COMPLIANT">{{ t('status.compliant') }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="sort-filter">{{ t('team.sortBy') }}</label>
          <select
            id="sort-filter"
            [(ngModel)]="sortBy"
            (ngModelChange)="onFilterChange()"
          >
            <option value="deadline">{{ t('team.sortDeadline') }}</option>
            <option value="name">{{ t('team.sortName') }}</option>
            <option value="progress">{{ t('team.sortProgress') }}</option>
          </select>
        </div>

        <button class="export-btn" (click)="exportReport()">
          {{ t('team.export') }}
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="stats-grid" [attr.aria-label]="t('team.summary')">
        <div class="stat-card total">
          <span class="stat-value">{{ total() }}</span>
          <span class="stat-label">{{ t('team.employees') }}</span>
        </div>
        <div class="stat-card at-risk">
          <span class="stat-value">{{ atRiskCount() }}</span>
          <span class="stat-label">{{ t('status.atRisk') }}</span>
        </div>
        <div class="stat-card non-compliant">
          <span class="stat-value">{{ nonCompliantCount() }}</span>
          <span class="stat-label">{{ t('status.nonCompliant') }}</span>
        </div>
        <div class="stat-card compliant">
          <span class="stat-value">{{ compliantCount() }}</span>
          <span class="stat-label">{{ t('status.compliant') }}</span>
        </div>
      </div>

      <!-- Team List -->
      @if (loading()) {
        <div class="loading" aria-live="polite">
          <span class="spinner" aria-hidden="true"></span>
          {{ t('team.loading') }}
        </div>
      } @else if (error()) {
        <div class="error" role="alert">
          {{ error() }}
          <button (click)="loadData()">{{ t('common.retry') }}</button>
        </div>
      } @else if (members().length === 0) {
        <div class="empty-state">
          <p>{{ t('team.noMembers') }}</p>
        </div>
      } @else {
        <table
          class="team-table"
          role="grid"
          [attr.aria-label]="t('team.tableLabel')"
        >
          <thead>
            <tr>
              <th scope="col">{{ t('team.columnName') }}</th>
              <th scope="col">{{ t('team.columnRole') }}</th>
              <th scope="col">{{ t('team.columnProgress') }}</th>
              <th scope="col">{{ t('team.columnDeadline') }}</th>
              <th scope="col">{{ t('team.columnStatus') }}</th>
            </tr>
          </thead>
          <tbody>
            @for (member of members(); track member.userId) {
              <tr
                [class.at-risk]="member.status === 'AT_RISK'"
                [class.non-compliant]="member.status === 'NON_COMPLIANT'"
              >
                <td>
                  <div class="member-name">
                    <span>{{ member.userName }}</span>
                    <span class="member-email">{{ member.email }}</span>
                  </div>
                </td>
                <td>{{ t(getCareRoleI18nKey(member.careRole)) }}</td>
                <td>
                  <div class="progress-cell">
                    <div class="progress-bar-small">
                      <div
                        class="progress-fill"
                        [style.width.%]="member.percentComplete"
                      ></div>
                    </div>
                    <span class="progress-text">
                      {{ member.completedHours | number: '1.0-1' }} /
                      {{ member.requiredHours }}h
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    class="days-remaining"
                    [class.urgent]="member.daysRemaining < 30"
                  >
                    {{ t('team.daysRemaining', { count: member.daysRemaining }) }}
                  </span>
                </td>
                <td>
                  <span
                    class="status-badge"
                    [class]="member.status.toLowerCase()"
                  >
                    {{ t(getStatusI18nKey(member.status)) }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Pagination -->
        @if (total() > pageSize()) {
          <nav class="pagination" [attr.aria-label]="t('common.pagination')">
            <button
              [disabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)"
              [attr.aria-label]="t('common.previousPage')"
            >
              {{ t('common.previous') }}
            </button>
            <span class="page-info">
              {{
                t('common.pageInfo', {
                  current: currentPage(),
                  total: totalPages()
                })
              }}
            </span>
            <button
              [disabled]="currentPage() === totalPages()"
              (click)="goToPage(currentPage() + 1)"
              [attr.aria-label]="t('common.nextPage')"
            >
              {{ t('common.next') }}
            </button>
          </nav>
        }
      }
    </div>
  `,
  styles: `
    .team-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .dashboard-header {
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

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--cc-text-muted, #6b7280);
      }

      select {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--cc-border, #d1d5db);
        border-radius: 6px;
        font-size: 0.875rem;
        min-width: 150px;
      }
    }

    .export-btn {
      margin-left: auto;
      padding: 0.5rem 1rem;
      background: var(--cc-surface, #fff);
      border: 1px solid var(--cc-border, #d1d5db);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;

      &:hover {
        background: var(--cc-surface-alt, #f9fafb);
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--cc-surface, #fff);
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid var(--cc-border, #e5e7eb);
      text-align: center;

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--cc-text, #111827);
      }

      .stat-label {
        font-size: 0.75rem;
        color: var(--cc-text-muted, #6b7280);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      &.at-risk {
        border-left: 4px solid var(--cc-warning, #f59e0b);
        .stat-value {
          color: var(--cc-warning, #f59e0b);
        }
      }

      &.non-compliant {
        border-left: 4px solid var(--cc-error, #ef4444);
        .stat-value {
          color: var(--cc-error, #ef4444);
        }
      }

      &.compliant {
        border-left: 4px solid var(--cc-success, #10b981);
        .stat-value {
          color: var(--cc-success, #10b981);
        }
      }
    }

    .team-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--cc-surface, #fff);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--cc-border, #e5e7eb);

      th,
      td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--cc-border, #e5e7eb);
      }

      th {
        background: var(--cc-surface-alt, #f9fafb);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--cc-text-muted, #6b7280);
      }

      tbody tr {
        &:hover {
          background: var(--cc-surface-alt, #f9fafb);
        }

        &.at-risk {
          background: rgba(245, 158, 11, 0.05);
        }

        &.non-compliant {
          background: rgba(239, 68, 68, 0.05);
        }
      }
    }

    .member-name {
      display: flex;
      flex-direction: column;

      .member-email {
        font-size: 0.75rem;
        color: var(--cc-text-muted, #6b7280);
      }
    }

    .progress-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .progress-bar-small {
      width: 100%;
      height: 6px;
      background: var(--cc-progress-bg, #e5e7eb);
      border-radius: 3px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: var(--cc-primary, #3b82f6);
        border-radius: 3px;
      }
    }

    .progress-text {
      font-size: 0.75rem;
      color: var(--cc-text-muted, #6b7280);
    }

    .days-remaining {
      font-weight: 500;

      &.urgent {
        color: var(--cc-error, #ef4444);
        font-weight: 600;
      }
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;

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

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;

      button {
        padding: 0.5rem 1rem;
        background: var(--cc-surface, #fff);
        border: 1px solid var(--cc-border, #d1d5db);
        border-radius: 6px;
        cursor: pointer;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &:hover:not(:disabled) {
          background: var(--cc-surface-alt, #f9fafb);
        }
      }

      .page-info {
        font-size: 0.875rem;
        color: var(--cc-text-muted, #6b7280);
      }
    }

    .loading,
    .error,
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: var(--cc-surface, #fff);
      border-radius: 8px;
      border: 1px solid var(--cc-border, #e5e7eb);
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--cc-text-muted, #6b7280);

      .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid var(--cc-border, #e5e7eb);
        border-top-color: var(--cc-primary, #3b82f6);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    .error {
      color: var(--cc-error, #ef4444);

      button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: var(--cc-primary, #3b82f6);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class TeamDashboardComponent implements OnInit {
  private readonly educationService = inject(EducationTrackingService);

  // State
  readonly members = signal<TeamMemberCompliance[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Filters
  statusFilter = '';
  sortBy: 'deadline' | 'name' | 'progress' = 'deadline';

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);
  readonly totalPages = signal(1);

  // Computed stats
  readonly atRiskCount = signal(0);
  readonly nonCompliantCount = signal(0);
  readonly compliantCount = signal(0);

  // For demo, use a fixed facility ID
  private readonly facilityId = 'facility-1';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    const filters: TeamComplianceFilters = {
      status: this.statusFilter as ComplianceStatus | undefined,
      sortBy: this.sortBy,
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    this.educationService.getTeamCompliance(this.facilityId, filters).subscribe({
      next: (result) => {
        this.members.set(result.members);
        this.total.set(result.total);
        this.totalPages.set(Math.ceil(result.total / this.pageSize()));
        this.calculateStats(result.members);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load team data');
        this.loading.set(false);
      },
    });
  }

  private calculateStats(members: TeamMemberCompliance[]): void {
    this.atRiskCount.set(
      members.filter((m) => m.status === 'AT_RISK').length
    );
    this.nonCompliantCount.set(
      members.filter((m) => m.status === 'NON_COMPLIANT').length
    );
    this.compliantCount.set(
      members.filter((m) => m.status === 'COMPLIANT').length
    );
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadData();
  }

  exportReport(): void {
    // In real app, trigger backend export
    console.log('Export report requested');
  }

  getCareRoleI18nKey(role: CareRole): string {
    return CARE_ROLE_I18N_KEYS[role] || role;
  }

  getStatusI18nKey(status: ComplianceStatus): string {
    return STATUS_I18N_KEYS[status] || status;
  }
}
