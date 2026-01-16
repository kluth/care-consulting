# Technical Decisions: Fortbildungsmanager

## Related ADRs

| ADR                                                                | Title                           | Status   | Summary                                               |
| ------------------------------------------------------------------ | ------------------------------- | -------- | ----------------------------------------------------- |
| [ADR-0016](../../adr/0016-fortbildung-certificate-verification.md) | Certificate Verification System | Accepted | RS256 JWT with short URL for QR verification          |
| [ADR-0017](../../adr/0017-fortbildung-reminder-system.md)          | Reminder System                 | Accepted | Multi-channel (Email + Push + In-App) with Bull queue |
| [ADR-0012](../../adr/0012-certificate-generation.md)               | Certificate Generation          | Accepted | PDFKit for certificate PDF generation                 |

## Decision Summary

| Area                     | Decision                                     | ADR Reference |
| ------------------------ | -------------------------------------------- | ------------- |
| Certificate Verification | RS256 JWT + Short URL QR codes               | ADR-0016      |
| Reminder Delivery        | Bull queue + multi-channel notifications     | ADR-0017      |
| PDF Generation           | PDFKit (existing)                            | ADR-0012      |
| State Management         | Angular Signals (consistent with platform)   | -             |
| API Design               | RESTful endpoints under `/api/fortbildung/*` | -             |

## Key Trade-offs Accepted

1. **RSA Key Management Complexity** - Accepted for cryptographic non-repudiation
2. **Redis Dependency for Bull** - Accepted for reliable scheduled job processing
3. **Multi-channel Complexity** - Accepted for maximum notification reach
4. **Online Verification Required** - Accepted; offline verification not critical for MDK audits
