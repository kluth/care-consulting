# Technical Decisions: Gamification

## Related ADRs

| ADR                                                  | Title                     | Status   | Summary                        |
| ---------------------------------------------------- | ------------------------- | -------- | ------------------------------ |
| [ADR-0011](../../adr/0011-gamification-engine.md)    | Gamification Architecture | Accepted | Custom NestJS Service + Prisma |
| [ADR-0012](../../adr/0012-certificate-generation.md) | Certificate Generation    | Accepted | PDFKit (Backend)               |

## Decision Summary

| Area             | Decision                  | Rationale                                                                              |
| ---------------- | ------------------------- | -------------------------------------------------------------------------------------- |
| **Engine**       | **Custom NestJS Service** | Deep integration with `User`/`Course` models; avoids SaaS vendor lock-in/cost.         |
| **Storage**      | **PostgreSQL (Prisma)**   | Relational data integrity for XP/Badges is crucial. Performance is sufficient for MVP. |
| **Certificates** | **PDFKit (Server-side)**  | Secure generation of "Official" docs. Prevents client-side tampering.                  |
| **Leaderboards** | **SQL Queries**           | Simple `ORDER BY` works for current scale. Redis added later if needed.                |

## Key Trade-offs Accepted

- **Performance:** SQL leaderboards are slower than Redis at massive scale (>1M users), but we accept this for simpler infrastructure (no new Redis dependency to manage yet).
- **Complexity:** Building custom logic takes more dev time than a plug-and-play library, but offers full control over "Official" accreditation logic.
