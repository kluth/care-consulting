import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'landing-impressum',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="legal-page">
      <div class="legal-page__container">
        <a routerLink="/" class="legal-page__back">&larr; Zurück zur Startseite</a>

        <h1>Impressum</h1>

        <section>
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            Care Consulting<br />
            Dr. Anna Berger<br />
            Musterstraße 123<br />
            10115 Berlin
          </p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>
            Telefon: +49 30 12345678<br />
            E-Mail: info&#64;care-consulting.de
          </p>
        </section>

        <section>
          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE XXX XXX XXX
          </p>
        </section>

        <section>
          <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
          <p>
            Berufsbezeichnung: Pflegeberaterin<br />
            Zuständige Kammer: [Kammer einfügen]<br />
            Verliehen in: Deutschland
          </p>
        </section>

        <section>
          <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            Dr. Anna Berger<br />
            Musterstraße 123<br />
            10115 Berlin
          </p>
        </section>

        <section>
          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        </section>

        <section>
          <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .legal-page {
      padding: 2rem;
      min-height: 100vh;
      background-color: var(--color-background, #f7fafc);
    }

    .legal-page__container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 3rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .legal-page__back {
      display: inline-block;
      margin-bottom: 2rem;
      color: var(--color-primary, #1a365d);
      text-decoration: none;
    }

    .legal-page__back:hover {
      text-decoration: underline;
    }

    h1 {
      font-size: 2rem;
      color: var(--color-text-primary, #1a202c);
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 1.25rem;
      color: var(--color-text-primary, #1a202c);
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      color: var(--color-text-secondary, #4a5568);
      line-height: 1.7;
      margin-bottom: 1rem;
    }

    a {
      color: var(--color-primary, #1a365d);
    }

    section {
      margin-bottom: 1.5rem;
    }
  `],
})
export class ImpressumPage {}
