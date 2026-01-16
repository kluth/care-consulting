import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'landing-datenschutz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="legal-page">
      <div class="legal-page__container">
        <a routerLink="/" class="legal-page__back">&larr; Zurück zur Startseite</a>

        <h1>Datenschutzerklärung</h1>

        <section>
          <h2>1. Datenschutz auf einen Blick</h2>
          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2>2. Hosting</h2>
          <p>
            Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
          </p>
          <h3>Externes Hosting</h3>
          <p>
            Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser
            Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann
            es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
            Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über
            eine Website generiert werden, handeln.
          </p>
        </section>

        <section>
          <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
          <h3>Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
            Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den
            gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>

          <h3>Hinweis zur verantwortlichen Stelle</h3>
          <p>
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p>
            Care Consulting<br />
            Dr. Anna Berger<br />
            Musterstraße 123<br />
            10115 Berlin<br />
            E-Mail: info&#64;care-consulting.de
          </p>
        </section>

        <section>
          <h2>4. Datenerfassung auf dieser Website</h2>

          <h3>Cookies</h3>
          <p>
            Diese Website verwendet keine Cookies für Tracking-Zwecke. Wir setzen auf
            datenschutzfreundliche Analyse mit Plausible Analytics, die ohne Cookies auskommt
            und vollständig DSGVO-konform ist.
          </p>

          <h3>Kontaktformular</h3>
          <p>
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus
            dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks
            Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </p>

          <h3>Newsletter</h3>
          <p>
            Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir
            von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung
            gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem
            Empfang des Newsletters einverstanden sind.
          </p>
        </section>

        <section>
          <h2>5. Analyse-Tools</h2>
          <h3>Plausible Analytics</h3>
          <p>
            Wir nutzen Plausible Analytics zur Analyse des Nutzerverhaltens auf unserer Website.
            Plausible ist ein datenschutzfreundliches Analyse-Tool, das:
          </p>
          <ul>
            <li>Keine Cookies verwendet</li>
            <li>Keine personenbezogenen Daten sammelt</li>
            <li>Vollständig DSGVO-konform ist</li>
            <li>In der EU gehostet wird</li>
          </ul>
          <p>
            Weitere Informationen finden Sie unter:
            <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">
              https://plausible.io/data-policy
            </a>
          </p>
        </section>

        <section>
          <h2>6. Plugins und Tools</h2>

          <h3>Cal.com (Terminbuchung)</h3>
          <p>
            Für die Online-Terminbuchung nutzen wir den Dienst Cal.com. Wenn Sie einen Termin
            buchen, werden die von Ihnen eingegebenen Daten an Cal.com übermittelt. Cal.com ist
            DSGVO-konform. Weitere Informationen finden Sie in der Datenschutzerklärung von
            Cal.com.
          </p>

          <h3>Auth0 (Authentifizierung)</h3>
          <p>
            Für die Benutzeranmeldung in unserem Bildungsportal nutzen wir Auth0. Auth0 ist
            DSGVO-konform und verarbeitet Daten gemäß den europäischen Datenschutzstandards.
          </p>
        </section>

        <section>
          <h2>7. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht:</p>
          <ul>
            <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten</li>
            <li>Berichtigung unrichtiger Daten zu verlangen</li>
            <li>Löschung Ihrer Daten zu verlangen</li>
            <li>Einschränkung der Verarbeitung zu verlangen</li>
            <li>Widerspruch gegen die Verarbeitung einzulegen</li>
            <li>Datenübertragbarkeit zu verlangen</li>
          </ul>
          <p>
            Wenn Sie der Meinung sind, dass die Verarbeitung Ihrer Daten gegen das
            Datenschutzrecht verstößt, können Sie sich bei der zuständigen Aufsichtsbehörde
            beschweren.
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

    h3 {
      font-size: 1.1rem;
      color: var(--color-text-primary, #1a202c);
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p, li {
      color: var(--color-text-secondary, #4a5568);
      line-height: 1.7;
      margin-bottom: 1rem;
    }

    ul {
      padding-left: 1.5rem;
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
export class DatenschutzPage {}
