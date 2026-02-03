# ADR-0019: Shift-Aware Learning & Scheduling Integration

## Status

Proposed

## Date

2026-01-16

## Context

Care workers operate 24/7 with irregular shifts. Traditional training schedules don't work. The platform should adapt to users' work schedules and offer "micro-learning" opportunities during natural breaks.

## Research Findings

### Industry Insights

- Healthcare operates 24/7 with shifts that rarely fit traditional training
- Night-shift workers need training available at 2 AM between patients
- "Daily bursts" of 3-5 minutes using spaced repetition are effective
- Mobile-first is essential for on-the-go learning

### Existing Solutions

- **Axonify**: 3-5 minute daily bursts with AI-driven spaced repetition
- **ShiftCare**: Integrates scheduling with training assignments
- Facilities save 30+ minutes/day with integrated systems

## Decision

Implement **Shift-Aware Learning** with:

1. **Calendar Integration**
   - Import shift schedules (iCal, manual entry)
   - Identify optimal learning windows
   - Respect rest periods (no notifications during off-time)

2. **Micro-Learning Mode**
   - Bite-sized lessons (3-5 minutes)
   - Spaced repetition for compliance topics
   - Offline-capable for areas with poor connectivity

3. **Smart Notifications**
   - Learn user's preferred times
   - Suggest training during detected breaks
   - Avoid interrupting patient care

4. **Team Training Coordination**
   - PDL can assign training to shift groups
   - Automatic scheduling around shift patterns
   - Track completion by shift/team

## Rationale

Research shows micro-learning with spaced repetition improves retention while respecting healthcare workers' time constraints. Shift integration ensures training reaches workers regardless of their schedule.

## Consequences

### Positive

- Higher training completion rates
- Respects work-life balance
- Better knowledge retention
- Accessible to all shift patterns

### Negative

- Calendar integration complexity
- Need to maintain micro-learning content versions
- Offline sync complexity

## References

- [Axonify Micro-Learning Approach](https://www.axonify.com/)
- [iSpring Healthcare LMS Solutions](https://www.ispringsolutions.com/blog/healthcare-lms)
- ADR-0003: Scheduling Integration (existing)
