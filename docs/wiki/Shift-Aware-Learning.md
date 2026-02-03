# Schicht-bewusstes Lernen (Shift-Aware Learning)

Das System passt sich dem Arbeitsalltag von Pflegekräften an, anstatt starre Lernzeiten vorauszusetzen. Basierend auf [ADR-0019](../adr/0019-shift-aware-learning.md).

## Kernkonzepte

### 1. Dienstplan-Integration
Nutzer können ihre Schichten hinterlegen oder importieren. Das System erkennt:
- **Lern-Fenster:** Zeiten zwischen den Schichten oder während bekannter ruhiger Phasen.
- **Ruhezeiten:** Keine Benachrichtigungen während der Freizeit oder unmittelbar nach dem Nachtdienst.

### 2. Micro-Learning (3-5 Min)
Inhalte sind in extrem kurze Einheiten unterteilt, die ideal für kurze Pausen sind.
- **Micro-Lektionen:** Fokus auf ein spezifisches Thema.
- **Spaced Repetition:** Automatisches Wiederholen von Compliance-Themen in wachsenden Abständen.

## Datenmodelle
- `UserShift`: Speichert Schichtzeiten und -typen.
- `MicroLessonProgress`: Trackt den Fortschritt für Spaced Repetition (Leitner-System).
