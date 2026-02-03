# ADR-0021: AI-Powered Nursing Documentation Assistant (NODA)

## Status

Proposed

## Date

2026-02-03

## Context

Care workers spend up to 40% of their time on documentation. Manual entry is prone to errors and often done late at night when fatigue is high. A smart assistant could reduce this burden by converting voice or short notes into structured professional documentation.

## Decision

Implement **NODA (Nursing Documentation Assistant)** with:

1. **Voice-to-Structure**
   - Record short voice memos during tours.
   - AI extracts clinical facts and maps them to the SIS® (Strukturierte Informationssammlung) model.

2. **Smart Suggestions**
   - Automatically suggest nursing phenomena based on clinical notes.
   - Detect inconsistencies in documentation.

3. **Privacy-First Processing**
   - PII (Personally Identifiable Information) scrubbing before AI processing.
   - Local-first processing where possible.

## Rationale

Reducing documentation time directly combats burnout and increases time for actual patient care. Structured data improves care quality and audit readiness.

## Consequences

### Positive
- Massive time savings.
- Higher documentation quality.
- Reduced cognitive load.

### Negative
- High dependency on AI accuracy.
- Strict data protection requirements (GDPR/HiPAA).
