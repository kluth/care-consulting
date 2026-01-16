# ADR-0013: Audit Engine Architecture

## Status

Accepted

## Date

2026-01-16

## Context

We need a flexible system to conduct Quality Audits (MDK-Prüfungen). The structure (Questions, Sections, Weighting) changes based on facility type (Ambulant/Stationär) and regulatory updates.

## Decision

We will use a **Relational Template Versioning** strategy.

### Schema

- `AuditTemplate` (e.g., "MDK 2025")
- `AuditSection` (e.g., "Hygiene")
- `AuditQuestion` (e.g., "Is hand sanitizer available?")
- `AuditRun` (An instance of an audit by a user)
- `AuditAnswer` (The user's response)

### Versioning

Templates are **immutable** once published. Updates create a new `AuditTemplate` (v2). Old `AuditRuns` point to the `AuditTemplate` ID they were started with, ensuring historical accuracy.

## Rationale

- **Data Integrity:** Relational integrity ensures we can run analytics across thousands of audits (e.g., "Find all facilities failing Question 3.1").
- **History:** Immutable templates prevent "breaking" past audit reports when regulations change.

## Consequences

- **Complexity:** Managing template versions requires a dedicated Admin UI or seed scripts.
- **Migration:** No migration needed for old reports; they just reference old templates.
