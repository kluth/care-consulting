# ADR-0010: Payment Gateway

## Status

Proposed

## Date

2026-01-15

## Context

We need to process payments for courses and bundles.

## Research Findings

### Option 1: Stripe

- **Pros:** Developer standard, excellent documentation, handles tax/invoicing (Stripe Tax/Invoicing).
- **Cons:** Transaction fees.

### Option 2: PayPal

- **Pros:** Trusted by some consumers.
- **Cons:** Developer experience is inferior to Stripe.

## Decision

We will use **Stripe**.

## Rationale

Stripe offers the best DX and features like "Stripe Checkout" which handles PCI compliance and UI for us.

## Consequences

- **Positive:** Robust payment processing.
- **Negative:** Fees.
