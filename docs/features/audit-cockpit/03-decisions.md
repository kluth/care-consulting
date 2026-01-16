# Technical Decisions: Audit Cockpit

## Related ADRs

- [ADR-0013](../../adr/0013-audit-engine.md) - Relational Template Versioning

## Key Decisions

| Area        | Decision                | Reason                                                         |
| ----------- | ----------------------- | -------------------------------------------------------------- |
| **Schema**  | **Relational**          | Analytics capability is priority.                              |
| **Scoring** | **Backend Calculation** | "Official" grades must be calculated securely.                 |
| **UI**      | **Wizard / Stepper**    | Break massive audits (80+ questions) into digestible Sections. |
| **Reports** | **PDFKit**              | Re-using the CertificateService stack for Audit Reports.       |
