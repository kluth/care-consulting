# ADR-0011: Gamification Architecture

## Status

Accepted

## Date

2026-01-16

## Context

The platform requires a gamification system (XP, Badges, Levels) to drive engagement. We need to decide whether to buy a SaaS solution, use an open-source engine, or build custom.

## Research Findings

- **SaaS (e.g., BadgeUp):** Expensive, data lives outside our DB, potential GDPR friction.
- **Open Source Engines:** Often complex to integrate into an existing NestJS/Prisma stack.
- **Custom:** Best integration, zero license cost, fits our specific "Care Consulting" data model perfectly.

## Decision

We will build a **Custom NestJS Gamification Module**.

## Rationale

Our gamification logic is tightly coupled to specific domain events (Course Completion, Quiz Pass). A custom service listening to internal events (using `EventEmitter2`) is the cleanest architectural pattern.

## Consequences

- **Positive:** Perfect fit for our needs, full data ownership.
- **Negative:** We write and maintain the code.
