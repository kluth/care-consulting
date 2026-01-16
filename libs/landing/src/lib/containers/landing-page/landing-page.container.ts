import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  viewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

import { ContentService } from '../../services/content.service';
import { LandingPageContent, NewsletterSubscription } from '../../models/content.model';

import { HeroComponent } from '../../components/hero/hero.component';
import { ServicesComponent } from '../../components/services/services.component';
import { EducationComponent } from '../../components/education/education.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { AboutComponent } from '../../components/about/about.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { BookingWidgetComponent } from '../../components/booking-widget/booking-widget.component';
import { NewsletterFormComponent } from '../../components/newsletter-form/newsletter-form.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthButtonComponent } from '@care-consulting/education';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    HeroComponent,
    ServicesComponent,
    EducationComponent,
    TestimonialsComponent,
    AboutComponent,
    ContactComponent,
    BookingWidgetComponent,
    NewsletterFormComponent,
    LanguageSwitcherComponent,
    AuthButtonComponent,
  ],
  template: `
    <a
      data-testid="skip-link"
      href="#main-content"
      class="skip-link"
    >
      Zum Hauptinhalt springen
    </a>

    <header class="header">
      <div class="header__container">
        <a href="/" class="header__logo">Care Consulting</a>
        <nav class="header__nav">
          <landing-language-switcher />
          <education-auth-button />
        </nav>
      </div>
    </header>

    @if (contentService.isLoading()) {
      <div data-testid="loading-skeleton" class="loading-skeleton">
        <div class="skeleton-hero"></div>
        <div class="skeleton-section"></div>
        <div class="skeleton-section"></div>
      </div>
    } @else if (contentService.error()) {
      <div data-testid="content-error" class="content-error">
        <p>{{ contentService.error() }}</p>
        <button data-testid="retry-button" (click)="loadContent()">
          Erneut versuchen
        </button>
      </div>
    } @else {
      <main id="main-content">
        <section aria-labelledby="hero-heading">
          <landing-hero
            [content]="content()?.hero"
            (ctaClick)="scrollToBooking()"
          />
        </section>

        <section aria-labelledby="services-title">
          <landing-services
            [content]="content()?.services"
            (serviceClick)="onServiceClick($event)"
          />
        </section>

        <section id="booking" aria-label="Termin buchen" class="booking-section">
          <div class="booking-section__container">
            <h2>Beratungstermin vereinbaren</h2>
            <p>Wählen Sie einen passenden Termin für Ihr kostenloses Erstgespräch.</p>
            <landing-booking-widget
              [calComUrl]="'https://cal.com/care-consulting/consultation'"
              [fallbackEmail]="content()?.footer?.contact?.email ?? 'info@care-consulting.de'"
              (bookingCompleted)="onBookingCompleted($event)"
            />
          </div>
        </section>

        <section aria-labelledby="education-title">
          <landing-education
            [content]="content()?.education"
            (webinarRegister)="onWebinarRegister()"
            (resourceDownload)="onResourceDownload($event)"
          />
        </section>

        <section aria-labelledby="testimonials-title">
          <landing-testimonials [content]="content()?.testimonials" />
        </section>

        <section aria-labelledby="about-title">
          <landing-about [content]="content()?.about" />
        </section>

        <section aria-label="Newsletter" class="newsletter-section">
          <div class="newsletter-section__container">
            <landing-newsletter-form
              (subscribe)="onNewsletterSubscribe($event)"
              (subscribeSuccess)="onNewsletterSuccess($event)"
            />
          </div>
        </section>
      </main>

      <landing-contact [content]="content()?.footer" />
    }
  `,
  styles: [`
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--color-primary, #1a365d);
      color: white;
      padding: 0.5rem 1rem;
      z-index: 1000;
      transition: top 0.2s;
    }

    .skip-link:focus {
      top: 0;
    }

    .header {
      position: sticky;
      top: 0;
      background: white;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
      z-index: 50;
    }

    .header__container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header__logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary, #1a365d);
      text-decoration: none;
    }

    .loading-skeleton {
      padding: 2rem;
    }

    .skeleton-hero {
      height: 60vh;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
    }

    .skeleton-section {
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .content-error {
      padding: 4rem 2rem;
      text-align: center;
    }

    .content-error p {
      color: #c53030;
      margin-bottom: 1rem;
    }

    .content-error button {
      padding: 0.75rem 1.5rem;
      background-color: var(--color-primary, #1a365d);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    main {
      min-height: 100vh;
    }

    .booking-section {
      padding: 4rem 2rem;
      background-color: var(--color-background, #f7fafc);
    }

    .booking-section__container {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    .booking-section h2 {
      font-size: clamp(1.5rem, 4vw, 2rem);
      margin-bottom: 0.5rem;
      color: var(--color-text-primary, #1a202c);
    }

    .booking-section p {
      color: var(--color-text-secondary, #4a5568);
      margin-bottom: 2rem;
    }

    .newsletter-section {
      padding: 4rem 2rem;
    }

    .newsletter-section__container {
      max-width: 500px;
      margin: 0 auto;
    }
  `],
})
export class LandingPageContainer implements OnInit, OnDestroy {
  readonly contentService = inject(ContentService);
  private translocoService = inject(TranslocoService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  content = signal<LandingPageContent | null>(null);

  newsletterForm = viewChild(NewsletterFormComponent);

  private langSubscription?: Subscription;

  ngOnInit(): void {
    this.loadContent();

    this.langSubscription = this.translocoService.langChanges$.subscribe((lang) => {
      this.document.documentElement.lang = lang;
      this.loadContent(lang);
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  loadContent(lang?: string): void {
    const language = lang || this.translocoService.getActiveLang();
    this.contentService.loadContent(language).subscribe({
      next: (content) => {
        this.content.set(content);
        this.updateMeta(content);
      },
      error: () => {
        // Error is handled by ContentService state
      },
    });
  }

  scrollToBooking(): void {
    this.trackEvent('cta_click', { location: 'hero' });
    const bookingSection = this.document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onServiceClick(serviceId: string): void {
    this.trackEvent('service_click', { serviceId });
  }

  onBookingCompleted(data: { eventId: string }): void {
    this.trackEvent('booking_completed', data);
  }

  onWebinarRegister(): void {
    this.trackEvent('webinar_register', {});
  }

  onResourceDownload(resourceId: string): void {
    this.trackEvent('resource_download', { resourceId });
  }

  onNewsletterSubscribe(data: NewsletterSubscription): void {
    this.trackEvent('newsletter_subscribe_attempt', { email: data.email });
    // In a real app, this would call an API
    // For now, simulate success
    setTimeout(() => {
      const form = this.newsletterForm();
      if (form) {
        form.handleResponse({
          success: true,
          message: 'Vielen Dank für Ihre Anmeldung!',
        });
      }
    }, 1000);
  }

  onNewsletterSuccess(response: { success: boolean }): void {
    this.trackEvent('newsletter_signup', response);
  }

  trackEvent(eventName: string, data: Record<string, unknown>): void {
    // Integration with Plausible or other analytics
    if (typeof window !== 'undefined' && (window as unknown as { plausible?: (event: string, options: { props: Record<string, unknown> }) => void }).plausible) {
      (window as unknown as { plausible: (event: string, options: { props: Record<string, unknown> }) => void }).plausible(eventName, { props: data });
    }
  }

  private updateMeta(content: LandingPageContent): void {
    this.titleService.setTitle(`${content.hero.title} | Care Consulting`);
    this.metaService.updateTag({
      name: 'description',
      content: content.hero.subtitle,
    });
  }
}
