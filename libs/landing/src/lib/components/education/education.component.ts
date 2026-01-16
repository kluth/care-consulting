import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EducationContent } from '../../models/content.model';

@Component({
  selector: 'landing-education',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    @if (content()) {
      <section class="education" aria-labelledby="education-title">
        <h2 id="education-title" data-testid="education-title">{{ content()?.sectionTitle }}</h2>
        @if (content()?.sectionSubtitle) {
          <p class="education__subtitle">{{ content()?.sectionSubtitle }}</p>
        }

        @if (content()?.webinar) {
          <div data-testid="webinar-section" class="webinar">
            <div class="webinar__content">
              <h3 data-testid="webinar-title">{{ content()?.webinar?.title }}</h3>
              <p data-testid="webinar-description">{{ content()?.webinar?.description }}</p>
              <div class="webinar__meta">
                <span data-testid="webinar-date">
                  <time [attr.datetime]="content()?.webinar?.date">
                    {{ content()?.webinar?.date | date:'fullDate' }}
                  </time>
                </span>
                <span data-testid="webinar-duration">{{ content()?.webinar?.duration }}</span>
              </div>
              <button
                data-testid="webinar-register-btn"
                class="webinar__cta"
                type="button"
                (click)="webinarRegister.emit()"
              >
                {{ content()?.webinar?.registrationCta }}
              </button>
            </div>
          </div>
        }

        @if (content()?.resources && content()!.resources!.length > 0) {
          <div class="resources">
            <h3>Kostenlose Ressourcen</h3>
            <div class="resources__grid">
              @for (resource of content()?.resources; track resource.id) {
                <article data-testid="resource-card" class="resource-card">
                  <div class="resource-card__icon" [attr.data-type]="resource.type"></div>
                  <h4 data-testid="resource-title">{{ resource.title }}</h4>
                  <p data-testid="resource-description">{{ resource.description }}</p>
                  @if (resource.downloadUrl) {
                    <a
                      data-testid="resource-download"
                      [href]="resource.downloadUrl"
                      class="resource-card__download"
                      download
                      (click)="onResourceDownload($event, resource.id)"
                    >
                      Herunterladen
                    </a>
                  }
                </article>
              }
            </div>
          </div>
        }
      </section>
    }
  `,
  styles: [`
    .education {
      padding: 4rem 2rem;
      text-align: center;
    }

    h2 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      margin-bottom: 0.5rem;
      color: var(--color-text-primary, #1a202c);
    }

    .education__subtitle {
      font-size: 1.125rem;
      color: var(--color-text-secondary, #4a5568);
      margin-bottom: 3rem;
    }

    .webinar {
      background: linear-gradient(135deg, var(--color-primary, #1a365d) 0%, #2c5282 100%);
      border-radius: 1rem;
      padding: 3rem;
      margin: 0 auto 3rem;
      max-width: 800px;
      color: white;
    }

    .webinar__content {
      text-align: left;
    }

    .webinar h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .webinar p {
      opacity: 0.9;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .webinar__meta {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .webinar__cta {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      background-color: white;
      color: var(--color-primary, #1a365d);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .webinar__cta:hover {
      transform: translateY(-2px);
    }

    .resources {
      max-width: 1000px;
      margin: 0 auto;
    }

    .resources h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: var(--color-text-primary, #1a202c);
    }

    .resources__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .resource-card {
      background: white;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: left;
    }

    .resource-card__icon {
      width: 40px;
      height: 40px;
      background-color: var(--color-primary-light, #ebf8ff);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .resource-card h4 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary, #1a202c);
    }

    .resource-card p {
      font-size: 0.875rem;
      color: var(--color-text-secondary, #4a5568);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .resource-card__download {
      display: inline-block;
      color: var(--color-primary, #1a365d);
      font-weight: 600;
      text-decoration: none;
    }

    .resource-card__download:hover {
      text-decoration: underline;
    }
  `],
})
export class EducationComponent {
  content = input<EducationContent>();
  webinarRegister = output<void>();
  resourceDownload = output<string>();

  onResourceDownload(event: Event, resourceId: string): void {
    this.resourceDownload.emit(resourceId);
  }
}
