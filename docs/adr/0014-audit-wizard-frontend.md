# ADR-0014: Audit Wizard Frontend Architecture

## Status

Accepted

## Date

2026-01-16

## Context

The Audit Cockpit requires a frontend interface to guide users through 80+ questions across multiple sections. The UI must handle:

- Complex navigation (Section -> Question).
- Autosaving answers.
- Real-time progress tracking.
- "Not Applicable" logic (skipping questions).

## Research Findings

- **Single Form:** Too overwhelming for 80 questions. Performance issues with rendering everything at once.
- **Router-based Stepper:** Good for deep linking, but complex to manage state between routes without a store.
- **Component-based Wizard (SignalStore):** Keeps state local to the feature, fast updates, easy to implement "Resume" functionality.

## Decision

We will use a **Component-based Wizard** managed by **@ngrx/signals (SignalStore)**.

## Rationale

- **Performance:** Signals provide fine-grained reactivity, essential for a UI updating progress bars and "saved" states instantly.
- **UX:** A "Wizard" mode focuses the user on one task (Section) at a time, reducing anxiety (key "Problem Statement" from Discovery).
- **State Management:** The `AuditRun` state (current section, answers cache) is complex enough to warrant a dedicated Store, but lightweight enough to avoid Global Redux.

## Consequences

- **Positive:** Smooth, app-like experience. easy "Save & Resume".
- **Negative:** Need to implement the "Stepper" logic manually (or wrap a UI lib).
