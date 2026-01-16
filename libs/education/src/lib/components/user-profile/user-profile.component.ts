import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { EnrollmentService, Enrollment } from '../../services/enrollment.service';
import { GamificationService, GamificationProfile } from '../../services/gamification.service';
import { AffiliateService } from '../../services/affiliate.service';
import { BadgeDisplayComponent } from '../badge-display/badge-display.component';
import { LevelProgressComponent } from '../level-progress/level-progress.component';
import { UiButtonComponent } from '@care-consulting/ui';

@Component({
  selector: 'education-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeDisplayComponent, LevelProgressComponent, UiButtonComponent],
  template: `
    <div class="profile-page">
      <div class="profile-page__container">
        @if (auth.user$ | async; as user) {
          <header class="profile-header">
            <div class="profile-header__avatar">
              @if (user.picture) {
                <img [src]="user.picture" [alt]="user.name || 'User'" />
              } @else {
                <div class="avatar-placeholder">{{ getInitials(user) }}</div>
              }
            </div>
            <div class="profile-header__info">
              <h1>{{ user.name || user.email }}</h1>
              <p class="profile-header__email">{{ user.email }}</p>
            </div>
          </header>

          @if (gamificationProfile(); as gameProfile) {
            <section class="profile-section">
              <h2>Mein Fortschritt</h2>
              <education-level-progress
                [level]="gameProfile.level"
                [currentXp]="gameProfile.xp"
                [nextLevelXp]="500" 
              />
              <div class="badges-container">
                <h3>Meine Abzeichen</h3>
                <education-badge-display [badges]="gameProfile.badges" />
              </div>
            </section>
          }

          <section class="profile-section">
            <h2>Partnerprogramm (Affiliate)</h2>
            <div class="affiliate-box">
              @if (affiliateCode()) {
                <p>Dein Empfehlungscode:</p>
                <div class="code-display">{{ affiliateCode() }}</div>
                <p class="small">Teile diesen Code und erhalte 10% Provision.</p>
              } @else {
                <p>Werde Partner und verdiene Geld mit Empfehlungen.</p>
                <ui-button (click)="generateAffiliateCode()">Code generieren</ui-button>
              }
            </div>
          </section>

          <section class="profile-section">
            <h2>Meine Kurse</h2>
            @if (isLoadingEnrollments()) {
              <div class="loading">Kurse werden geladen...</div>
            } @else if (enrollments().length === 0) {
              <div class="empty-state">
                <p>Sie haben noch keine Kurse gebucht.</p>
                <a routerLink="/courses" class="btn btn--primary">Kurse entdecken</a>
              </div>
            } @else {
              <div class="enrollments-list">
                @for (enrollment of enrollments(); track enrollment.id) {
                  <div class="enrollment-card">
                    <div class="enrollment-card__info">
                      <h3>{{ enrollment.courseId }}</h3>
                      <p class="enrollment-card__date">
                        Eingeschrieben am: {{ enrollment.enrolledAt | date:'dd.MM.yyyy' }}
                      </p>
                      <span
                        class="enrollment-card__status"
                        [class.active]="enrollment.status === 'ACTIVE'"
                        [class.expired]="enrollment.status === 'EXPIRED'"
                      >
                        {{ getStatusLabel(enrollment.status) }}
                      </span>
                    </div>
                    @if (enrollment.status === 'ACTIVE') {
                      <a
                        [routerLink]="['/courses', enrollment.courseId, 'learn']"
                        class="btn btn--primary"
                      >
                        Weiter lernen
                      </a>
                    }
                  </div>
                }
              </div>
            }
          </section>

          <section class="profile-section">
            <h2>Kontoeinstellungen</h2>
            <div class="settings-list">
              <button class="settings-item" (click)="logout()">
                <span class="settings-item__icon">🚪</span>
                <span class="settings-item__label">Abmelden</span>
              </button>
            </div>
          </section>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      background-color: var(--color-background, #f7fafc);
      padding: 2rem;
    }

    .profile-page__container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .profile-header__avatar img,
    .avatar-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }

    .avatar-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary, #1a365d);
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .profile-header__info h1 {
      margin: 0 0 0.25rem 0;
      font-size: 1.5rem;
      color: var(--color-text-primary, #1a202c);
    }

    .profile-header__email {
      margin: 0;
      color: var(--color-text-secondary, #4a5568);
    }

    .profile-section {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }

    .profile-section h2 {
      font-size: 1.25rem;
      margin: 0 0 1rem 0;
      color: var(--color-text-primary, #1a202c);
    }

    .badges-container {
      margin-top: 1.5rem;
    }
    
    .badges-container h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .affiliate-box {
      background: #f0fff4;
      border: 1px solid #c6f6d5;
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .code-display {
      font-size: 2rem;
      font-weight: bold;
      color: #2f855a;
      letter-spacing: 2px;
      margin: 1rem 0;
      font-family: monospace;
      background: white;
      padding: 0.5rem;
      border-radius: 0.25rem;
      display: inline-block;
    }

    .small {
      font-size: 0.875rem;
      color: #4a5568;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-secondary, #4a5568);
    }

    .empty-state p {
      margin-bottom: 1rem;
    }

    .enrollments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .enrollment-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 0.375rem;
    }

    .enrollment-card h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }

    .enrollment-card__date {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary, #4a5568);
    }

    .enrollment-card__status {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      border-radius: 0.25rem;
      text-transform: uppercase;
    }

    .enrollment-card__status.active {
      background: #c6f6d5;
      color: #22543d;
    }

    .enrollment-card__status.expired {
      background: #fed7d7;
      color: #822727;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .settings-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
      text-align: left;
    }

    .settings-item:hover {
      background-color: var(--color-background, #f7fafc);
    }

    .settings-item__icon {
      font-size: 1.25rem;
    }

    .settings-item__label {
      color: var(--color-text-primary, #1a202c);
    }

    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }

    .btn--primary {
      background: var(--color-primary, #1a365d);
      color: white;
    }

    .btn--primary:hover {
      opacity: 0.9;
    }
  `],
})
export class UserProfileComponent implements OnInit {
  auth = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private gamificationService = inject(GamificationService);
  private affiliateService = inject(AffiliateService);
  private doc = inject(DOCUMENT);

  enrollments = signal<Enrollment[]>([]);
  gamificationProfile = signal<GamificationProfile | null>(null);
  affiliateCode = signal<string | null>(null);
  isLoadingEnrollments = signal(true);

  ngOnInit(): void {
    this.loadEnrollments();
    this.loadGamification();
  }

  loadGamification(): void {
    this.gamificationService.getProfile().subscribe((profile) => {
      this.gamificationProfile.set(profile);
    });
  }

  generateAffiliateCode(): void {
    this.affiliateService.generateCode().subscribe((res) => {
      this.affiliateCode.set(res.code);
    });
  }

  loadEnrollments(): void {
    this.isLoadingEnrollments.set(true);
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments.set(enrollments);
        this.isLoadingEnrollments.set(false);
      },
      error: () => {
        this.isLoadingEnrollments.set(false);
      },
    });
  }

  getInitials(user: User): string {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      ACTIVE: 'Aktiv',
      EXPIRED: 'Abgelaufen',
      CANCELLED: 'Storniert',
      REFUNDED: 'Erstattet',
    };
    return labels[status] || status;
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }
}
