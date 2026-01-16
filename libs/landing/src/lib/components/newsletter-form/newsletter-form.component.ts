import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  NewsletterSubscription,
  NewsletterSubscriptionResponse,
} from '../../models/content.model';

@Component({
  selector: 'landing-newsletter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isSuccess()) {
      <div
        data-testid="newsletter-success"
        class="newsletter__success"
        role="status"
      >
        <p>{{ successMessage() }}</p>
      </div>
    } @else {
      <div class="newsletter">
        <h3>{{ titleText() }}</h3>
        <p class="newsletter__subtitle">{{ subtitleText() }}</p>

        @if (errorMessage()) {
          <div
            data-testid="newsletter-error"
            class="newsletter__error"
            role="alert"
          >
            {{ errorMessage() }}
          </div>
        }

        @if (alreadySubscribedMessage()) {
          <div
            data-testid="newsletter-message"
            class="newsletter__message"
            role="status"
          >
            {{ alreadySubscribedMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="newsletter__form">
          <div class="newsletter__field">
            <label for="newsletter-email" class="visually-hidden">
              E-Mail-Adresse
            </label>
            <input
              data-testid="newsletter-email-input"
              id="newsletter-email"
              type="email"
              formControlName="email"
              [placeholder]="emailPlaceholder()"
              [attr.aria-describedby]="form.get('email')?.invalid && form.get('email')?.touched ? 'email-error' : null"
              class="newsletter__input"
            />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span
                data-testid="email-error"
                id="email-error"
                class="newsletter__field-error"
                role="alert"
              >
                {{ emailErrorMessage() }}
              </span>
            }
          </div>

          <div class="newsletter__consent">
            <input
              id="newsletter-consent"
              type="checkbox"
              formControlName="consent"
            />
            <label for="newsletter-consent">
              Ich stimme der Verarbeitung meiner Daten gemäß der
              <a data-testid="privacy-link" href="/datenschutz" target="_blank">
                Datenschutzerklärung
              </a>
              zu.
            </label>
          </div>

          <button
            data-testid="newsletter-submit"
            type="submit"
            class="newsletter__submit"
            [disabled]="form.invalid || isSubmitting()"
          >
            @if (isSubmitting()) {
              <span
                data-testid="newsletter-loader"
                class="newsletter__loader"
                aria-live="polite"
              >
                Wird gesendet...
              </span>
            } @else {
              {{ submitButtonText() }}
            }
          </button>
        </form>
      </div>
    }
  `,
  styles: [`
    .newsletter {
      padding: 2rem;
      background-color: var(--color-background, #f7fafc);
      border-radius: 0.75rem;
      text-align: center;
    }

    .newsletter h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary, #1a202c);
    }

    .newsletter__subtitle {
      color: var(--color-text-secondary, #4a5568);
      margin-bottom: 1.5rem;
    }

    .newsletter__form {
      max-width: 400px;
      margin: 0 auto;
    }

    .newsletter__field {
      margin-bottom: 1rem;
    }

    .newsletter__input {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      border: 2px solid var(--color-border, #e2e8f0);
      border-radius: 0.5rem;
      transition: border-color 0.2s;
    }

    .newsletter__input:focus {
      outline: none;
      border-color: var(--color-primary, #1a365d);
    }

    .newsletter__input:invalid:not(:placeholder-shown) {
      border-color: #c53030;
    }

    .newsletter__field-error {
      display: block;
      color: #c53030;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      text-align: left;
    }

    .newsletter__consent {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      text-align: left;
      font-size: 0.875rem;
    }

    .newsletter__consent input {
      margin-top: 0.25rem;
    }

    .newsletter__consent a {
      color: var(--color-primary, #1a365d);
    }

    .newsletter__submit {
      width: 100%;
      padding: 0.875rem;
      font-size: 1rem;
      font-weight: 600;
      background-color: var(--color-primary, #1a365d);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s, opacity 0.2s;
    }

    .newsletter__submit:hover:not(:disabled) {
      background-color: #2c5282;
    }

    .newsletter__submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .newsletter__success {
      padding: 2rem;
      background-color: #c6f6d5;
      border-radius: 0.75rem;
      text-align: center;
    }

    .newsletter__success p {
      color: #276749;
      font-weight: 600;
    }

    .newsletter__error {
      padding: 0.75rem;
      background-color: #fed7d7;
      color: #c53030;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .newsletter__message {
      padding: 0.75rem;
      background-color: #bee3f8;
      color: #2b6cb0;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .newsletter__loader {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `],
})
export class NewsletterFormComponent {
  private fb = inject(FormBuilder);

  // Text inputs for i18n
  titleText = input<string>('Newsletter');
  subtitleText = input<string>('Erhalten Sie regelmäßig Tipps und Neuigkeiten');
  emailPlaceholder = input<string>('Ihre E-Mail-Adresse');
  submitButtonText = input<string>('Abonnieren');

  // Events
  subscribe = output<NewsletterSubscription>();
  subscribeSuccess = output<NewsletterSubscriptionResponse>();
  subscribeError = output<Error>();

  // State
  isSubmitting = signal(false);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);
  alreadySubscribedMessage = signal<string | null>(null);
  successMessage = signal<string>('Vielen Dank für Ihre Anmeldung!');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    consent: [false, [Validators.requiredTrue]],
  });

  emailErrorMessage(): string {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) {
      return 'E-Mail-Adresse ist erforderlich';
    }
    if (emailControl?.hasError('email')) {
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.alreadySubscribedMessage.set(null);

    const subscription: NewsletterSubscription = {
      email: this.form.get('email')?.value.trim(),
      consentGiven: this.form.get('consent')?.value,
    };

    this.subscribe.emit(subscription);
  }

  handleResponse(response: NewsletterSubscriptionResponse): void {
    this.isSubmitting.set(false);

    if (response.success) {
      if (response.alreadySubscribed) {
        this.alreadySubscribedMessage.set(response.message);
      } else {
        this.isSuccess.set(true);
        this.successMessage.set(response.message);
      }
      this.subscribeSuccess.emit(response);
    } else {
      this.errorMessage.set(response.message);
    }
  }

  handleError(error: Error): void {
    this.isSubmitting.set(false);
    this.errorMessage.set('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    this.subscribeError.emit(error);
  }
}
