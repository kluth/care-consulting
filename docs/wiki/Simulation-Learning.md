# Simulation-Based Learning (Branching Scenarios)

Praktische Entscheidungskompetenz wird durch interaktive Fallbeispiele trainiert. Basierend auf [ADR-0020](../adr/0020-simulation-based-learning.md).

## Funktionsweise

### 1. Branching Scenarios
Nutzer werden mit einer klinischen Situation konfrontiert und müssen Entscheidungen treffen.
- **Konsequenzen:** Jede Entscheidung beeinflusst den weiteren Verlauf des Szenarios.
- **Feedback:** Sofortige Rückmeldung bei kritischen Fehlentscheidungen (z.B. falsche Medikamentendosis).

### 2. Szenario-Editor
Admins können visuell Szenarien erstellen:
- **Knoten:** Text, Bild/Audio und Entscheidungspunkte.
- **Punkte:** Bewertung der getroffenen Entscheidungen.

## Anwendungsgebiete
- Notfallmanagement (Sturz, Reanimation)
- Medikamentengabe
- Kommunikation mit Angehörigen
- Hygiene-Protokolle

## Technische Umsetzung
- Speicherung als JSON-Graph.
- Player als schlanke Angular-Standalone-Komponente.
