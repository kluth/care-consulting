# ADR-0018: Wellness & Burnout Prevention Module

## Status

Proposed

## Date

2026-01-16

## Context

Research shows 76% of healthcare workers experience burnout symptoms. Care workers face high stress, irregular shifts, and emotional demands. The platform should support their mental well-being to improve retention and care quality.

## Research Findings

### Industry Data

- 90% of employees experienced burnout symptoms in the past year
- Physician turnover from burnout costs ~$4.6 billion annually in the US
- Care workers are among the highest burnout risk groups
- Digital wellness tools can provide early intervention

### Key Features from Research

- **Mood tracking** with simple daily check-ins
- **Micro-interventions** (2-3 minute exercises)
- **Burnout risk assessment** (CBI - Copenhagen Burnout Inventory)
- **Manager alerts** for at-risk team members (anonymized)
- **Peer support** connections

## Decision

Implement a **Wellness Module** with:

1. **Daily Check-in** (optional)
   - Simple mood scale (1-5)
   - Quick stress indicator
   - Takes <30 seconds

2. **Burnout Risk Assessment**
   - Quarterly validated assessment (CBI)
   - Personal trend tracking
   - Personalized recommendations

3. **Micro-interventions Library**
   - Breathing exercises (2-3 min)
   - Guided stretches for physical strain
   - Mindfulness moments
   - Gratitude prompts

4. **Anonymous Team Wellness Dashboard**
   - Aggregated mood trends (no individual data)
   - Early warning indicators for managers
   - Suggested team interventions

## Rationale

Prevention is more effective and cost-efficient than treating burnout. Low-friction daily check-ins combined with micro-interventions can catch issues early. Anonymized team data helps managers address systemic issues without invading privacy.

## Consequences

### Positive

- Early detection of burnout risk
- Reduced turnover
- Improved care quality
- Demonstrates employer care for staff

### Negative

- Privacy concerns require careful handling
- Risk of "wellness washing" if not genuine
- Requires ongoing content curation

### Privacy Safeguards

- Individual data never shared with managers
- Team data only shown as aggregates (min 5 people)
- Users can opt out entirely
- Data retention limited to 12 months

## References

- [NYU Langone COBALT App Research](https://physicianfocus.nyulangone.org/)
- [Wellhub Burnout Prevention Guide](https://wellhub.com/en-us/blog/)
- Copenhagen Burnout Inventory (CBI) validation studies
