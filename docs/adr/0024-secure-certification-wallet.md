# ADR-0024: Secure Certification Wallet (JWT & QR-Verification)

## Status

Proposed

## Date

2026-02-03

## Context

Certificates in healthcare are often physical or easily forged PDFs. Employers and authorities need a way to verify training completion instantly and securely without manual background checks.

## Decision

Implement **Secure Certification Wallet** with:

1. **Digital Signing (RS256)**
   - Sign certificate data (User ID, Course ID, Date) using a private key.
   - Issue a JWT (JSON Web Token) containing the signed payload.

2. **QR-Code Verification**
   - Embed a unique verification URL/QR-Code on every certificate.
   - Public endpoint `/verify/:shortId` validates the signature against our public key.

3. **User Wallet (Mobile PWA)**
   - Dedicated UI for users to store, view, and share their certificates as QR codes or Apple/Google Wallet passes (planned).

## Rationale

Increases trust in the platform's certifications and reduces administrative overhead for facilities during audits.
