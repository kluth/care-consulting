# ADR-0009: Real-time Communication (Chat/Forum)

## Status

Proposed

## Date

2026-01-15

## Context

We need real-time chat for cohorts and forums for asynchronous discussion.

## Research Findings

### Option 1: Managed Service (Stream.io / Pusher)

- **Pros:** "It just works", scalable.
- **Cons:** Expensive.

### Option 2: Self-Hosted Socket.io (NestJS Gateway)

- **Pros:** Free (resource usage only), tight integration with our DB/Auth, we already run NestJS.
- **Cons:** We manage scaling (Redis adapter needed for multiple instances).

## Decision

We will use **Socket.io (via NestJS Gateways)**.

## Rationale

Since we are building a custom NestJS backend and our expected concurrent user count for the MVP is manageable (dozens to hundreds, not millions), Socket.io is cost-effective and integrates perfectly with our existing Prisma/Postgres data models for storing chat history.

## Consequences

- **Positive:** No extra SaaS bill, full data ownership.
- **Negative:** Need to implement chat logic (rooms, history) manually.
