import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesContent } from '../../models/content.model';

@Component({
  selector: 'landing-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (content()) {
      <section class="services" aria-labelledby="services-title">
        <h2 id="services-title" data-testid="services-title">{{ content()?.sectionTitle }}</h2>
        @if (content()?.sectionSubtitle) {
          <p data-testid="services-subtitle" class="services__subtitle">
            {{ content()?.sectionSubtitle }}
          </p>
        }
        <div data-testid="services-grid" class="services__grid">
          @for (service of content()?.services; track service.id) {
            <article
              data-testid="service-card"
              class="service-card"
              tabindex="0"
              (click)="serviceClick.emit(service.id)"
              (keydown.enter)="serviceClick.emit(service.id)"
            >
              <div class="service-card__icon" [attr.data-icon]="service.icon">
                <!-- Icon would be rendered here -->
              </div>
              <h3 data-testid="service-title">{{ service.title }}</h3>
              <p data-testid="service-description">{{ service.description }}</p>
              @if (service.features && service.features.length > 0) {
                <ul class="service-card__features">
                  @for (feature of service.features; track feature) {
                    <li data-testid="service-feature">{{ feature }}</li>
                  }
                </ul>
              }
            </article>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    .services {
      padding: 4rem 2rem;
      text-align: center;
      background-color: var(--color-background, #f7fafc);
    }

    h2 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      margin-bottom: 0.5rem;
      color: var(--color-text-primary, #1a202c);
    }

    .services__subtitle {
      font-size: 1.125rem;
      color: var(--color-text-secondary, #4a5568);
      margin-bottom: 3rem;
    }

    .services__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .service-card {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      text-align: left;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .service-card:focus-visible {
      outline: 3px solid var(--color-primary, #1a365d);
      outline-offset: 2px;
    }

    .service-card__icon {
      width: 48px;
      height: 48px;
      background-color: var(--color-primary-light, #ebf8ff);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .service-card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: var(--color-text-primary, #1a202c);
    }

    .service-card p {
      color: var(--color-text-secondary, #4a5568);
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .service-card__features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .service-card__features li {
      background-color: var(--color-primary-light, #ebf8ff);
      color: var(--color-primary, #1a365d);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
    }
  `],
})
export class ServicesComponent {
  content = input<ServicesContent>();
  serviceClick = output<string>();
}
