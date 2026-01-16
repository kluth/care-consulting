# ADR-0008: Live Course Delivery

## Status

Proposed

## Date

2026-01-15

## Context

We need to deliver live training sessions.

## Research Findings

### Option 1: Zoom Meeting SDK (Embedded)

- **Pros:** Users stay in our app.
- **Cons:** Very heavy, complex to implement, mobile browser issues common.

### Option 2: Daily.co / Jitsi

- **Pros:** Built for embedding.
- **Cons:** Cost (Daily), Maintenance (Jitsi self-hosted).

### Option 3: Secure Link Sharing (Zoom/Teams)

- **Pros:** Zero dev effort for video streaming, users know the tools, reliability.
- **Cons:** Users leave the platform.

## Decision

We will use **Secure Link Sharing (Zoom)** for the MVP.

## Rationale

Building a reliable live video conferencing tool is extremely complex. Zoom is the industry standard. We will manage the _scheduling_ and _access control_ (providing the link only to enrolled students) in our app, but the actual video session will happen in the Zoom client.

## Consequences

- **Positive:** High reliability, low dev effort.
- **Negative:** Context switch for the user.
