import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutContent } from '../../models/content.model';

@Component({
  selector: 'landing-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (content()) {
      <section class="about" aria-labelledby="about-title">
        <h2 id="about-title" data-testid="about-title">{{ content()?.sectionTitle }}</h2>
        @if (content()?.introduction) {
          <p data-testid="about-introduction" class="about__intro">
            {{ content()?.introduction }}
          </p>
        }

        <div class="about__team">
          @for (member of content()?.team; track member.id) {
            <article data-testid="member-card" class="member-card">
              @if (member.photo) {
                <img
                  data-testid="member-photo"
                  [src]="member.photo"
                  [alt]="member.name"
                  class="member-card__photo"
                />
              } @else {
                <div class="member-card__photo-placeholder"></div>
              }
              <div class="member-card__content">
                <h3 data-testid="member-name">{{ member.name }}</h3>
                <p data-testid="member-role" class="member-card__role">{{ member.role }}</p>
                <p data-testid="member-bio" class="member-card__bio">{{ member.bio }}</p>

                @if (member.credentials && member.credentials.length > 0) {
                  <ul data-testid="credentials-list" class="member-card__credentials">
                    @for (credential of member.credentials; track credential) {
                      <li data-testid="member-credential">{{ credential }}</li>
                    }
                  </ul>
                }

                @if (member.linkedIn) {
                  <a
                    data-testid="member-linkedin"
                    [href]="member.linkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="member-card__linkedin"
                  >
                    LinkedIn Profil
                  </a>
                }
              </div>
            </article>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    .about {
      padding: 4rem 2rem;
      text-align: center;
    }

    h2 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      margin-bottom: 1rem;
      color: var(--color-text-primary, #1a202c);
    }

    .about__intro {
      font-size: 1.125rem;
      color: var(--color-text-secondary, #4a5568);
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.6;
    }

    .about__team {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
    }

    .member-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      max-width: 400px;
      text-align: left;
    }

    .member-card__photo {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .member-card__photo-placeholder {
      width: 100%;
      height: 300px;
      background: linear-gradient(135deg, var(--color-primary-light, #ebf8ff) 0%, #bee3f8 100%);
    }

    .member-card__content {
      padding: 1.5rem;
    }

    .member-card h3 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
      color: var(--color-text-primary, #1a202c);
    }

    .member-card__role {
      font-size: 1rem;
      color: var(--color-primary, #1a365d);
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .member-card__bio {
      color: var(--color-text-secondary, #4a5568);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .member-card__credentials {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .member-card__credentials li {
      background-color: var(--color-primary-light, #ebf8ff);
      color: var(--color-primary, #1a365d);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
    }

    .member-card__linkedin {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #0077b5;
      font-weight: 600;
      text-decoration: none;
    }

    .member-card__linkedin:hover {
      text-decoration: underline;
    }
  `],
})
export class AboutComponent {
  content = input<AboutContent>();
}
