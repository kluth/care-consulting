import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'landing-agb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="legal-page">
      <div class="legal-page__container">
        <a routerLink="/" class="legal-page__back">&larr; Zurück zur Startseite</a>

        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

        <section>
          <h2>§ 1 Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Care
            Consulting, Dr. Anna Berger (nachfolgend "Anbieter") und dem Kunden (nachfolgend
            "Kunde") über Beratungsleistungen, Schulungen und Online-Kurse.
          </p>
        </section>

        <section>
          <h2>§ 2 Vertragsschluss</h2>
          <p>
            (1) Die Darstellung der Leistungen auf der Website stellt kein rechtlich bindendes
            Angebot, sondern eine unverbindliche Aufforderung zur Buchung dar.
          </p>
          <p>
            (2) Durch die Buchung einer Leistung über die Website gibt der Kunde ein
            verbindliches Angebot ab. Der Vertrag kommt zustande, wenn der Anbieter die Buchung
            durch eine Bestätigungs-E-Mail annimmt.
          </p>
        </section>

        <section>
          <h2>§ 3 Leistungen</h2>
          <h3>Beratungsleistungen</h3>
          <p>
            Der Anbieter erbringt Beratungsleistungen im Bereich Qualitätsmanagement,
            Prozessoptimierung und Schulungen für Pflegeeinrichtungen. Art und Umfang der
            Leistungen ergeben sich aus der jeweiligen Leistungsbeschreibung.
          </p>
          <h3>Online-Kurse</h3>
          <p>
            Bei Online-Kursen erhält der Kunde nach Zahlungseingang Zugang zu den gebuchten
            Kursinhalten. Der Zugang ist zeitlich unbegrenzt, sofern nicht anders angegeben.
          </p>
        </section>

        <section>
          <h2>§ 4 Preise und Zahlung</h2>
          <p>
            (1) Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer.
          </p>
          <p>
            (2) Die Zahlung erfolgt über die angebotenen Zahlungsmethoden (Kreditkarte, SEPA).
            Bei Beratungsleistungen kann eine Zahlung auf Rechnung vereinbart werden.
          </p>
          <p>
            (3) Bei Zahlungsverzug ist der Anbieter berechtigt, Verzugszinsen in gesetzlicher
            Höhe zu berechnen.
          </p>
        </section>

        <section>
          <h2>§ 5 Widerrufsrecht</h2>
          <p>
            Verbraucher haben ein Widerrufsrecht von 14 Tagen. Das Widerrufsrecht erlischt bei
            digitalen Inhalten vorzeitig, wenn der Kunde ausdrücklich zugestimmt hat, dass der
            Anbieter mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnt.
          </p>
          <h3>Widerrufsbelehrung</h3>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag
            zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
            Vertragsabschlusses.
          </p>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung
            (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen
            Vertrag zu widerrufen, informieren.
          </p>
        </section>

        <section>
          <h2>§ 6 Urheberrecht</h2>
          <p>
            (1) Alle Kursinhalte, Schulungsmaterialien und Dokumente sind urheberrechtlich
            geschützt und dürfen nur für den persönlichen Gebrauch verwendet werden.
          </p>
          <p>
            (2) Eine Vervielfältigung, Verbreitung oder öffentliche Zugänglichmachung der
            Inhalte ohne ausdrückliche Zustimmung des Anbieters ist untersagt.
          </p>
        </section>

        <section>
          <h2>§ 7 Haftung</h2>
          <p>
            (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie
            für die Verletzung von Leben, Körper und Gesundheit.
          </p>
          <p>
            (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher
            Vertragspflichten, begrenzt auf den vorhersehbaren, vertragstypischen Schaden.
          </p>
        </section>

        <section>
          <h2>§ 8 Datenschutz</h2>
          <p>
            Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung
            und den geltenden Datenschutzbestimmungen.
          </p>
        </section>

        <section>
          <h2>§ 9 Schlussbestimmungen</h2>
          <p>
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
            UN-Kaufrechts.
          </p>
          <p>
            (2) Gerichtsstand ist, soweit gesetzlich zulässig, Berlin.
          </p>
          <p>
            (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit
            der übrigen Bestimmungen unberührt.
          </p>
        </section>

        <p class="legal-page__date">Stand: Januar 2026</p>
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

    .legal-page__date {
      margin-top: 3rem;
      font-style: italic;
      font-size: 0.875rem;
    }
  `],
})
export class AgbPage {}
