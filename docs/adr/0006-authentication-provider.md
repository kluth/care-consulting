# ADR-0006: Authentication Provider Selection

## Status

Proposed

## Date

2026-01-15

## Context

The Education Platform requires robust user authentication for B2B (care facilities) and B2C (caregivers) users. We need secure sign-up, log-in, session management, and ideally profile management without building it all from scratch.

## Research Findings

### Option 1: Custom Auth (NestJS + Passport + JWT)

- **Pros:** Full control, no external costs, fits existing tech stack.
- **Cons:** High security risk (we own the hash), high maintenance (MFA, reset password flows), time-consuming to build UI.

### Option 2: Auth0

- **Pros:** Enterprise standard, B2B features (Organizations), excellent security, Angular/NestJS SDKs.
- **Cons:** Can get expensive, redirects user for login (unless using custom domains which cost more).

### Option 3: Firebase Auth

- **Pros:** Free tier is generous, easy to use, handles UI (FirebaseUI).
- **Cons:** Vendor lock-in, data model is separate from our SQL DB.

### Option 4: Clerk

- **Pros:** Excellent "User Profile" UI components out of the box, easy DX.
- **Cons:** Newer in Angular ecosystem compared to React.

## Decision

We will use **Auth0**.

## Rationale

For a professional "Care Consulting" platform that targets B2B clients, Auth0 provides the reliability and security features (like potential SSO integration in the future) that corporate clients expect. It offloads the complexity of Identity Management completely.

## Consequences

- **Positive:** rapid implementation of secure auth, MFA support ready.
- **Negative:** External dependency, monthly cost as users grow.
- **Risks:** Angular SDK integration complexity (usually low).
