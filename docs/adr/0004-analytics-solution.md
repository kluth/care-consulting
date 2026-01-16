# ADR-0004: Privacy-Focused Analytics Solution

## Status

Proposed

## Date

2026-01-14

## Context

We need website analytics to understand visitor behavior, track conversion rates, and measure marketing effectiveness. The solution must be GDPR-compliant without requiring cookie consent banners, aligning with our privacy-focused approach.

## Research Findings

### Option 1: Plausible Analytics

**Sources researched:**

- [Stackfix: Fathom vs Plausible 2025](https://www.stackfix.com/compare/fathom-product-analytics/plausible-product-analytics)
- [DataSag: Analytics Tools Compared](https://www.datasag.com/blog/analytics-tools-compared-plausible-fathom-datasag-ga4)
- [Andrew Bass: Plausible vs Fathom](https://www.andrewbass.dev/articles/plausible-vs-fathom)

**Pros (from research):**

- Fully EU-hosted infrastructure (ideal for German business)
- Open-source with self-hosting option
- Tracking script under 1KB - smallest in industry
- Cookieless and GDPR compliant out of the box
- Funnel drop-off analysis capabilities
- Simple, clean dashboard
- Goal conversion tracking with source attribution

**Cons (from research):**

- Less feature-rich than enterprise analytics
- Self-hosting requires technical expertise
- Smaller community than GA4

**Community sentiment:**
Best choice for small to medium businesses wanting simple, ethical analytics with strong privacy focus. Particularly recommended for EU-based businesses due to hosting location.

### Option 2: Fathom Analytics

**Sources researched:**

- [Stackfix: Fathom vs Plausible 2025](https://www.stackfix.com/compare/fathom-product-analytics/plausible-product-analytics)
- [Howuku: Fathom vs Plausible](https://howuku.com/blog/fathom-analytics-vs-plausible)

**Pros (from research):**

- Pioneer in ethical ad-blocker bypassing without compromising privacy
- GDPR, CCPA, PECR compliant by design
- Premium support and reliability
- Good balance between simplicity and depth
- Drill-down analysis capabilities

**Cons (from research):**

- Canadian-hosted (not EU)
- SaaS-only, no self-hosting option
- Cannot filter goal conversions by referrer/source/campaign
- Generally considered less feature-rich than Plausible

**Community sentiment:**
Solid choice for established businesses prioritizing reliability and premium support. Better for agencies managing multiple sites.

### Option 3: Google Analytics 4

**Pros:**

- Industry standard, extensive features
- Free tier very capable
- Large ecosystem of integrations
- Detailed user journey tracking

**Cons:**

- Requires cookie consent banner in EU
- Privacy concerns and data sent to Google
- Complex interface, steep learning curve
- Legal grey area in some EU countries

**Community sentiment:**
Powerful but increasingly problematic for EU privacy compliance. Many companies actively migrating away.

## Decision

We will use **Plausible Analytics** as our analytics solution.

## Rationale

Based on research and our German market focus:

1. **EU hosting** - Plausible's fully EU-based infrastructure is ideal for a German consulting business
2. **No cookie consent needed** - Removes friction and legal complexity
3. **GDPR compliant by design** - No configuration needed for privacy compliance
4. **Open-source** - Option to self-host for complete data sovereignty
5. **Tiny script** - Under 1KB won't impact page performance
6. **Funnel tracking** - Can track consultation booking conversions
7. **Source attribution** - Can see where converting visitors come from (important for marketing)
8. **Simple dashboard** - Easy to understand without analytics expertise

## Consequences

### Positive

- No cookie consent banner needed - cleaner UX
- Full GDPR compliance without legal risk
- Minimal performance impact
- Simple dashboard reduces learning curve
- Self-hosting option for future data sovereignty needs

### Negative

- Less detailed user journey analysis than GA4
- Smaller feature set for advanced marketing analytics
- Paid service (though affordable)

### Risks

- Business model changes could affect pricing (mitigated by self-hosting option)
- May need additional tools for advanced marketing attribution (acceptable trade-off)

## Implementation Notes

- Use Plausible cloud initially for quick setup
- Configure goals for: consultation bookings, newsletter signups, resource downloads
- Set up funnel tracking for booking flow
- Consider self-hosting after launch if data volume increases significantly

## Pricing

- Plausible starts at ~€9/month for up to 10k monthly pageviews
- Self-hosted option eliminates recurring cost

## References

- [Plausible Analytics](https://plausible.io)
- [Plausible Documentation](https://plausible.io/docs)
- [DesignModo: Privacy-Focused Analytics Alternatives](https://designmodo.com/google-analytics-alternatives/)
