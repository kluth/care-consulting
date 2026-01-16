# ADR-0020: Simulation-Based Clinical Decision Training

## Status

Proposed

## Date

2026-01-16

## Context

Care workers need practical decision-making skills that can't be fully taught through passive video content. Simulation-based learning with branching scenarios provides safe practice for critical situations.

## Research Findings

### Effectiveness of Simulation

- Interactive simulations improve retention by 75% vs passive learning
- Branching scenarios reflect real clinical decision-making
- Immediate feedback on critical steps (CPR, medication administration)
- Hands-on practice without patient risk

### Key Simulation Types for Care

1. **Emergency Response** - Cardiac arrest, falls, choking
2. **Medication Administration** - Dosage calculations, interaction checks
3. **Documentation** - SIS® structured model practice
4. **Communication** - Difficult conversations with patients/families
5. **Hygiene Protocols** - Infection control scenarios

## Decision

Implement **Branching Scenario Engine** with:

1. **Scenario Builder** (Admin)
   - Visual node-based editor for scenarios
   - Multiple choice decision points
   - Consequence branches
   - Scoring rubric definition

2. **Scenario Player** (Learner)
   - Immersive full-screen experience
   - Time-pressure options for emergency scenarios
   - Immediate feedback after each decision
   - Summary with learning points

3. **Scenario Library**
   - Pre-built scenarios for common care situations
   - Community-contributed scenarios (moderated)
   - Facility-specific custom scenarios

4. **Performance Analytics**
   - Track decision patterns
   - Identify knowledge gaps
   - Recommend follow-up training

## Technical Approach

- Scenario data stored as JSON graph structure
- Lightweight custom player (no heavy game engine)
- Optional media (images, audio) per node
- Mobile-responsive design

## Rationale

Passive video watching doesn't prepare workers for real decisions under pressure. Branching scenarios provide safe failure and learning opportunities. The investment in a scenario engine pays off through reusable content creation.

## Consequences

### Positive

- Practical skill development
- Safe failure environment
- Engaging learning experience
- Measurable competency assessment

### Negative

- Content creation requires clinical expertise
- More complex than video content
- Needs ongoing scenario maintenance

## References

- [AnyForSoft E-Learning for Healthcare Guide](https://anyforsoft.com/blog/e-learning-for-healthcare/)
- [iSpring Healthcare Training Best Practices](https://www.ispringsolutions.com/blog/elearning-healthcare)
- INACSL Standards of Best Practice: Simulation
