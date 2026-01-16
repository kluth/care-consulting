import { Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'education-auth-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (auth.isAuthenticated$ | async) {
      <div class="user-info">
        @if (auth.user$ | async; as user) {
          <span class="username">{{ user.name }}</span>
        }
        <button
          class="auth-btn auth-btn--logout"
          (click)="auth.logout({ logoutParams: { returnTo: doc.location.origin } })"
        >
          Logout
        </button>
      </div>
    } @else {
      <button
        class="auth-btn auth-btn--login"
        (click)="auth.loginWithRedirect()"
      >
        Login / Sign Up
      </button>
    }
  `,
  styles: [`
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .username {
      font-size: 0.875rem;
      font-weight: 500;
    }
    .auth-btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s;
    }
    .auth-btn--login {
      background-color: var(--color-primary, #1a365d);
      color: white;
    }
    .auth-btn--logout {
      background-color: #e2e8f0;
      color: #4a5568;
    }
    .auth-btn:hover {
      opacity: 0.9;
    }
  `]
})
export class AuthButtonComponent {
  auth = inject(AuthService);
  doc = inject(DOCUMENT);
}
