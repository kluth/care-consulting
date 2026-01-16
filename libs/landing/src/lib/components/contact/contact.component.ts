import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterContent } from '../../models/content.model';

@Component({
  selector: 'landing-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (content()) {
      <footer class="footer">
        <div class="footer__content">
          <div class="footer__contact">
            <h3>Kontakt</h3>
            <address>
              <a
                data-testid="contact-email"
                [href]="'mailto:' + content()?.contact?.email"
                class="footer__link"
              >
                {{ content()?.contact?.email }}
              </a>

              @if (content()?.contact?.phone) {
                <a
                  data-testid="contact-phone"
                  [href]="'tel:' + formatPhone(content()?.contact?.phone)"
                  class="footer__link"
                >
                  {{ content()?.contact?.phone }}
                </a>
              }

              @if (content()?.contact?.address) {
                <div data-testid="contact-address" class="footer__address">
                  <span>{{ content()?.contact?.address?.street }}</span>
                  <span>{{ content()?.contact?.address?.postalCode }} {{ content()?.contact?.address?.city }}</span>
                  <span>{{ content()?.contact?.address?.country }}</span>
                </div>
              }
            </address>
          </div>

          @if (content()?.socialLinks && content()!.socialLinks!.length > 0) {
            <div class="footer__social">
              <h3>Social Media</h3>
              <div class="footer__social-links">
                @for (link of content()?.socialLinks; track link.platform) {
                  <a
                    data-testid="social-link"
                    [href]="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    [attr.aria-label]="link.platform"
                    class="footer__social-link"
                  >
                    <span class="footer__social-icon" [attr.data-platform]="link.platform"></span>
                  </a>
                }
              </div>
            </div>
          }

          <div class="footer__legal">
            <nav aria-label="Legal links">
              <a href="/impressum">Impressum</a>
              <a href="/datenschutz">Datenschutz</a>
              <a href="/agb">AGB</a>
            </nav>
          </div>
        </div>

        <div class="footer__bottom">
          <p data-testid="copyright">{{ content()?.copyright }}</p>
        </div>
      </footer>
    }
  `,
  styles: [`
    .footer {
      background-color: var(--color-text-primary, #1a202c);
      color: white;
      padding: 3rem 2rem 1.5rem;
    }

    .footer__content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .footer address {
      font-style: normal;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer__link {
      color: white;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .footer__link:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    .footer__address {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.5rem;
      opacity: 0.8;
    }

    .footer__social-links {
      display: flex;
      gap: 1rem;
    }

    .footer__social-link {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .footer__social-link:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .footer__social-icon {
      width: 20px;
      height: 20px;
      background-color: white;
    }

    .footer__legal nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer__legal a {
      color: white;
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .footer__legal a:hover {
      opacity: 1;
      text-decoration: underline;
    }

    .footer__bottom {
      max-width: 1200px;
      margin: 1.5rem auto 0;
      text-align: center;
    }

    .footer__bottom p {
      opacity: 0.6;
      font-size: 0.875rem;
    }
  `],
})
export class ContactComponent {
  content = input<FooterContent>();

  formatPhone(phone: string | undefined): string {
    if (!phone) return '';
    return phone.replace(/\s/g, '');
  }
}
