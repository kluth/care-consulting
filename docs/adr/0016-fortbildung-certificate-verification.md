# ADR-0016: Fortbildung Certificate Verification System

## Status

Accepted

## Date

2026-01-16

## Context

The Fortbildungsmanager feature needs to generate certificates for completed continuing education periods that can be verified by MDK auditors and employers. Certificates must be verifiable via QR code without requiring login, while preventing forgery and protecting user privacy.

## Research Findings

### Option 1: JWT-based Signed Tokens (RS256)

**Sources researched:**

- [Curity JWT Best Practices](https://curity.io/resources/learn/jwt-best-practices/)
- [JWT Introduction](https://jwt.io/introduction)
- [VAADATA JWT Security](https://www.vaadata.com/blog/jwt-json-web-token-vulnerabilities-common-attacks-and-security-best-practices/)

**Pros:**

- Asymmetric cryptography (RS256) allows public verification without exposing private key
- Non-repudiation - only the server can sign certificates
- Self-contained - verification data in the token itself
- Industry standard with mature libraries

**Cons:**

- Larger token size (URL length concerns for QR codes)
- Cannot revoke individual certificates without blacklist
- Payload is readable (Base64), not encrypted

**Community sentiment:**
Widely recommended for scenarios requiring third-party verification. RS256 preferred over HMAC for public verification use cases.

### Option 2: HMAC (HS256) with Database Lookup

**Sources researched:**

- [Medium: JWT with HMAC Deep Dive](https://medium.com/@tcsantos472/understanding-jwt-authentication-with-hmac-a-deep-dive-into-secret-key-distribution-abe945db05fe)

**Pros:**

- Smaller token size
- Simpler implementation
- Can revoke by deleting from database

**Cons:**

- Requires database lookup for each verification
- Secret key must be shared with any verifying party
- No non-repudiation

**Community sentiment:**
Better for internal use cases where all verifiers are trusted. Not recommended for public verification.

### Option 3: Short Token + Database Lookup (UUID)

**Pros:**

- Minimal token size (ideal for QR codes)
- Full control over revocation
- No cryptographic complexity
- Can update certificate data without changing token

**Cons:**

- Requires online verification (no offline support)
- Database dependency for every verification
- No cryptographic proof of authenticity

**Community sentiment:**
Simple and effective for systems where online verification is acceptable.

## Decision

We will use **Option 1: JWT-based Signed Tokens (RS256)** combined with a short verification URL.

The QR code will contain a URL like:
`https://care-consulting.de/verify/{shortId}`

Where `{shortId}` maps to the full certificate record. The verification page will:

1. Look up the certificate by shortId
2. Display certificate details
3. Show cryptographic verification status (JWT signature valid)

This hybrid approach gives us:

- Short QR codes (URL with short ID)
- Cryptographic non-repudiation (JWT signature)
- Revocation capability (database lookup)
- Offline-capable verification page (once loaded)

## Rationale

Based on research, RS256 is the recommended algorithm for public verification scenarios because it allows anyone to verify without exposing the signing key. The hybrid approach with short IDs solves the QR code size problem while maintaining cryptographic integrity. MDK auditors can verify certificates instantly by scanning the QR code.

## Consequences

### Positive

- MDK auditors can verify certificates without login
- Cryptographic proof prevents forgery
- Certificates can be revoked if needed
- Professional appearance with QR verification

### Negative

- Requires RSA key management
- Need to handle key rotation
- Verification requires internet (for initial page load)

### Risks

- Key compromise would require reissuing all certificates
- Mitigation: Implement key rotation plan, store keys in secure vault

## References

- [JWT Best Practices - Curity](https://curity.io/resources/learn/jwt-best-practices/)
- [QR Code Security Best Practices 2025](https://qrcodia.com/blog/qr-code-security-best-practices/)
- ADR-0012: Certificate Generation (existing PDFKit infrastructure)
