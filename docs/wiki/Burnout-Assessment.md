# Burnout Risk Assessment (CBI)

Das Burnout-Risiko wird quartalsweise mit dem **Copenhagen Burnout Inventory (CBI)** gemessen. Dies ist ein wissenschaftlich validierter Fragebogen, der Burnout in drei Bereiche unterteilt:

## Die drei Dimensionen des CBI

1. **Persönliches Burnout:** Physische und psychische Erschöpfung, unabhängig vom Job.
2. **Arbeitsbezogenes Burnout:** Erschöpfung, die spezifisch auf die Arbeit zurückzuführen ist.
3. **Klientenbezogenes Burnout:** Erschöpfung durch die Arbeit mit Patienten/Bewohnern.

## Implementierung im Projekt

### Frontend
- **Komponente:** `BurnoutAssessmentComponent` (geplant)
- **Workflow:** Einmal pro Quartal wird der Nutzer gebeten, 19 Fragen auf einer Skala (Immer bis Nie) zu beantworten.
- **Visualisierung:** Historische Trends werden dem Nutzer privat in seinem Dashboard angezeigt.

### Backend
- **Prisma Modell:** `BurnoutAssessment`
- **Berechnung:** Der Score wird als Durchschnittswert (0-100) gespeichert.

## Wichtiger Hinweis zum Datenschutz
Wie in [ADR-0018](../adr/0018-wellness-burnout-prevention.md) festgelegt, sind die individuellen Ergebnisse für Facility Manager **nicht einsehbar**. Nur aggregierte Team-Daten werden ab einer Gruppengröße von 5 Personen angezeigt.
