# Feature Discovery: Fortbildungsmanager

## Date

2026-01-16

## Initial Idea

A continuing education tracking and compliance module for German care workers. It must track the mandatory 16h/2yr (or 24h/yr for Praxisanleiter), automatically remind users of upcoming deadlines, generate official certificates with QR verification, and provide a dashboard for facility managers to see team compliance status for MDK audits.

## Problem Statement

German care workers face strict legal requirements for continuing education:

- **Regular care workers**: Minimum 16 hours every 2 years (8h/year) per § 132 SGB V
- **Praxisanleiter (Practice Instructors)**: 24 hours annually, with at least 12h being pedagogical content

Facilities must document and prove compliance during MDK audits. Currently, this tracking is often done manually with spreadsheets or paper-based systems, leading to:

- Missed deadlines and compliance violations
- Difficulty proving compliance during audits
- No visibility into team-wide compliance status
- Lost certificates and documentation gaps

## Target Users

### Primary Users

1. **Pflegefachkräfte (Care Workers)** - Track their own continuing education progress
2. **Praxisanleiter (Practice Instructors)** - Higher requirements, need pedagogical hour tracking
3. **Pflegedienstleitung (PDL/Nursing Directors)** - Monitor team compliance
4. **Einrichtungsleitung (Facility Managers)** - MDK audit preparation, compliance reporting

### Secondary Users

- **MDK Auditors** - Verify compliance via QR codes on certificates
- **HR/Administration** - Integration with personnel management

## Success Criteria

1. **Compliance Rate**: 95%+ of staff meeting their continuing education requirements
2. **Audit Readiness**: <5 minutes to generate full compliance report for MDK
3. **User Engagement**: 80%+ of users logging their education within 1 week
4. **Certificate Verification**: QR codes resolve correctly 100% of the time
5. **Reminder Effectiveness**: 90%+ of users complete training before deadline after receiving reminders

## Related Existing Features

- **Gamification System** (XP, Badges) - Can award XP for completing continuing education
- **Certificate Generation** (ADR-0012) - Existing PDFKit infrastructure for certificates
- **Course System** - Courses can count toward continuing education hours
- **User Profiles** - Store role (Pflegefachkraft vs Praxisanleiter)

## Initial Questions/Concerns

1. How do we verify external training (not on our platform)?
2. Should certificates be stored or generated on-demand?
3. Integration with Pflegekammer digital verification systems?
4. How to handle users switching roles (e.g., becoming Praxisanleiter)?
5. Multi-facility support for organizations with multiple locations?
