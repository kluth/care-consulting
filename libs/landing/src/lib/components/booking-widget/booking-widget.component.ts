import {
  Component,
  input,
  output,
  signal,
  effect,
  OnInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'landing-booking-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div
        data-testid="booking-loader"
        class="booking__loader"
        role="status"
        aria-label="Kalender wird geladen"
        aria-live="polite"
      >
        <div class="booking__spinner"></div>
        <p>Kalender wird geladen...</p>
      </div>
    }

    @if (hasError()) {
      <div data-testid="booking-error" class="booking__error" role="alert">
        <p>Der Buchungskalender konnte nicht geladen werden.</p>
        <div data-testid="booking-fallback" class="booking__fallback">
          <p>Bitte kontaktieren Sie uns per E-Mail:</p>
          <a
            data-testid="booking-fallback-email"
            [href]="'mailto:' + fallbackEmail()"
          >
            {{ fallbackEmail() }}
          </a>
        </div>
        <button
          data-testid="booking-retry"
          class="booking__retry"
          type="button"
          (click)="retry()"
        >
          Erneut versuchen
        </button>
      </div>
    }

    @if (!isLoading() && !hasError()) {
      <div
        data-testid="booking-widget-container"
        class="booking__container"
        #calContainer
      >
        <!-- Cal.com embed will be injected here -->
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .booking__loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
    }

    .booking__spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-primary-light, #ebf8ff);
      border-top-color: var(--color-primary, #1a365d);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .booking__error {
      padding: 2rem;
      text-align: center;
      background-color: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 0.75rem;
    }

    .booking__error p {
      color: #c53030;
      margin-bottom: 1rem;
    }

    .booking__fallback {
      margin: 1.5rem 0;
    }

    .booking__fallback p {
      color: var(--color-text-secondary, #4a5568);
    }

    .booking__fallback a {
      color: var(--color-primary, #1a365d);
      font-weight: 600;
    }

    .booking__retry {
      padding: 0.75rem 1.5rem;
      background-color: var(--color-primary, #1a365d);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }

    .booking__retry:hover {
      background-color: #2c5282;
    }

    .booking__container {
      min-height: 500px;
      border-radius: 0.75rem;
      overflow: hidden;
    }
  `],
})
export class BookingWidgetComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  calComUrl = input<string>();
  fallbackEmail = input<string>('info@care-consulting.de');
  loadTimeout = input<number>(10000);

  bookingCompleted = output<{ eventId: string }>();
  errorOccurred = output<Error>();

  isLoading = signal(true);
  hasError = signal(false);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Validate URL on change
    effect(() => {
      const url = this.calComUrl();
      if (!url || url.trim() === '') {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCalComWidget();
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onWidgetLoad(): void {
    this.isLoading.set(false);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  onWidgetError(error: Error): void {
    this.hasError.set(true);
    this.isLoading.set(false);
    this.errorOccurred.emit(error);
  }

  onBookingComplete(data: { eventId: string }): void {
    this.bookingCompleted.emit(data);
  }

  retry(): void {
    this.hasError.set(false);
    this.isLoading.set(true);
    this.loadCalComWidget();
  }

  private loadCalComWidget(): void {
    const url = this.calComUrl();
    if (!url || url.trim() === '') {
      this.hasError.set(true);
      this.isLoading.set(false);
      return;
    }

    // Set timeout for loading
    this.timeoutId = setTimeout(() => {
      if (this.isLoading()) {
        this.onWidgetError(new Error('Widget load timeout'));
      }
    }, this.loadTimeout());

    // In a real implementation, this would load the Cal.com embed script
    // For now, simulate successful load after a short delay
    setTimeout(() => {
      if (!this.hasError()) {
        this.onWidgetLoad();
      }
    }, 500);
  }
}
