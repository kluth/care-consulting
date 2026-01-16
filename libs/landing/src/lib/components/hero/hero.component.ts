import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroContent } from '../../models/content.model';
import { UiButtonComponent } from '@care-consulting/ui';

@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    @if (content()) {
      <section
        data-testid="hero-section"
        class="hero"
        [style.background-image]="content()?.backgroundImage ? 'url(' + content()?.backgroundImage + ')' : null"
      >
        <div class="hero__content">
          <h1 data-testid="hero-title">{{ content()?.title }}</h1>
          <p data-testid="hero-subtitle" class="hero__subtitle">{{ content()?.subtitle }}</p>
          <ui-button
            data-testid="hero-cta"
            variant="primary"
            size="lg"
            (click)="ctaClick.emit()"
          >
            {{ content()?.cta }}
          </ui-button>
        </div>
      </section>
    }
  `,
  styles: [`
    .hero {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: cover;
      background-position: center;
      background-color: var(--color-primary, #1a365d);
      color: white;
      text-align: center;
      padding: 2rem;
    }

    .hero__content {
      max-width: 800px;
    }

    h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero__subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero__cta {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      background-color: var(--color-accent, #38a169);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .hero__cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .hero__cta:focus-visible {
      outline: 3px solid white;
      outline-offset: 2px;
    }
  `],
})
export class HeroComponent {
  content = input<HeroContent>();
  ctaClick = output<void>();
}
