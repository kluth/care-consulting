# Feature Discovery: Audit Cockpit (Qualitäts-Cockpit)

## Date

2026-01-16

## Initial Idea

A digital self-assessment tool for care facilities (B2B) to simulate official "Medizinischer Dienst" (MD) quality audits. Users answer official questions, upload evidence, and receive a predicted "Quality Grade" (Pflegenote 1.0 - 5.0) with actionable improvement tips.

## Problem Statement

- **Fear & Uncertainty:** Facility managers (PDL) are stressed about unannounced audits.
- **Complexity:** The official "Qualitätsprüfungs-Richtlinien" (QPR) are complex and hard to track manually (paper/Excel).
- **Consulting Gap:** Clients often don't know _what_ they are doing wrong until it's too late. This tool acts as a "Consulting Lead Magnet" – if they fail the self-audit, they book a paid expert session.

## Target Users

1.  **Facility Managers (PDL/EL):** Primary users executing the audit.
2.  **Quality Management Officers (QM-Beauftragte):** Responsible for ongoing compliance.
3.  **Consultants (Internal/External):** Using the tool to audit clients.

## Success Criteria

1.  **Utilization:** % of B2B users starting a self-audit.
2.  **Lead Generation:** % of "Failed" self-audits converting to paid consultation bookings (using our Cal.com integration).
3.  **User Confidence:** Qualitative feedback on reduced audit anxiety.

## Related Existing Features

- **Auth0:** B2B Identity management.
- **Affiliate/Gamification:** Could award badges for "Audit Ready" status.
- **Education:** Link "Failed" audit questions directly to relevant _Courses_ (e.g., "Failed Hygiene check? Take the Hygiene Course").

## Initial Questions/Concerns

- **Data Privacy:** Audit data is highly sensitive. Must be strictly siloed (already handled by Prisma/Postgres).
- **Accuracy:** The scoring logic (algorithms) must match the complex German QPR rules exactly to be valuable.
- **Updates:** Regulations change. How do we update templates? (We need a flexible Template Engine).
