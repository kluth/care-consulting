# ADR-0003: Scheduling/Booking Integration

## Status

Proposed

## Date

2026-01-14

## Context

The landing page's primary CTA is "Book a Consultation." We need a scheduling solution that allows visitors to book appointments directly. The solution must be GDPR-compliant, professional, and integrate seamlessly with the landing page.

## Research Findings

### Option 1: Calendly

**Sources researched:**

- [Cal.com vs Calendly comparison](https://cal.com/scheduling/calcom-vs-calendly)
- [Koalendar: Cal.com vs Calendly 2025](https://koalendar.com/blog/calcom-vs-calendly)
- [Efficient.app: Scheduler comparison](https://efficient.app/compare/cal-vs-calendly)

**Pros (from research):**

- Market leader with over a decade of experience
- Polished, user-friendly experience with minimal setup
- Extensive integrations ecosystem
- Ready-to-use solution for businesses of all sizes
- Strong team collaboration features
- ISO 27001, SOC 2 Type II, GDPR, CCPA compliant

**Cons (from research):**

- Proprietary, closed-source platform
- Less customizable than open-source alternatives
- Free plan limited to single calendar connection
- Teams plan costs $20/month per user
- No self-hosting option

**Community sentiment:**
Industry standard, reliable choice for teams wanting out-of-the-box functionality without technical complexity.

### Option 2: Cal.com

**Sources researched:**

- [Cal.com vs Calendly](https://cal.com/scheduling/calcom-vs-calendly)
- [House of FOSS: Open Source Calendly Alternatives 2025](https://www.houseoffoss.com/post/top-3-open-source-alternatives-to-calendly-in-2025-cal-com-easy-appointments-and-croodle)
- [YouCanBook.me: Cal.com vs Calendly 2026](https://youcanbook.me/blog/calendly-vs-cal-dot-com)

**Pros (from research):**

- Open-source with $7.4M seed funding
- Self-hosting option for full data control
- Free plan includes unlimited calendars, event types, workflows, and monetization
- Lower pricing: Teams at $15/month per user (vs Calendly's $20)
- ISO 27001, SOC 2 Type II, GDPR, CCPA compliant
- Extensive API for custom integrations
- White-labeling capabilities

**Cons (from research):**

- Ideal for teams with development resources
- Self-hosting requires technical expertise
- Newer platform, less polished than Calendly
- Smaller market presence

**Community sentiment:**
Developer-friendly, excellent for those who value open-source, customization, and data ownership. Best when you have technical resources available.

### Option 3: Simple Contact Form (fallback)

**Pros:**

- No external dependencies
- Full control over user experience
- No additional costs
- Works offline

**Cons:**

- Manual scheduling required
- No real-time availability
- Higher friction for users
- More work for consultant

## Decision

We will use **Cal.com** as the primary scheduling solution.

## Rationale

Based on research and our specific context:

1. **Open-source alignment** - Matches the project's Nx/Angular open-source stack philosophy
2. **GDPR compliance** - Both options are compliant, but Cal.com allows EU self-hosting if needed
3. **Cost efficiency** - Free tier includes features Calendly charges for (workflows, multiple calendars)
4. **Customization** - As a consulting page, we may want to customize the booking experience
5. **Developer resources available** - We have the technical capability to leverage Cal.com's flexibility
6. **Data ownership** - Option to self-host in the future if privacy requirements increase
7. **API availability** - Better integration possibilities with our NestJS backend

We will implement Cal.com's embed widget initially, with the option to migrate to self-hosted or deeper API integration later.

## Consequences

### Positive

- No cost for initial features (free tier is generous)
- Full customization potential as business grows
- Consistent with open-source tooling philosophy
- Self-hosting option provides exit strategy from SaaS dependency

### Negative

- Slightly less polished UX compared to Calendly
- May require more configuration for advanced features
- Smaller knowledge base for troubleshooting

### Risks

- Platform is newer, potential for breaking changes (mitigated by open-source - can fork if needed)
- Self-hosting would require DevOps investment (mitigated by using SaaS initially)

## Implementation Notes

- Start with Cal.com cloud (SaaS) for quick implementation
- Use embed widget for seamless landing page integration
- Evaluate self-hosting after initial launch if data sovereignty becomes a priority

## References

- [Cal.com Official Site](https://cal.com)
- [Cal.com vs Calendly Guide](https://cal.com/blog/cal-com-vs-calendly-the-ultimate-guide)
- [Cal.com Documentation](https://cal.com/docs)
