# Technical Decisions: Care Consulting Landing Page

## Related ADRs

| ADR                                                         | Title                         | Status   | Summary                                                         |
| ----------------------------------------------------------- | ----------------------------- | -------- | --------------------------------------------------------------- |
| [ADR-0002](../../adr/0002-internationalization-strategy.md) | Internationalization Strategy | Proposed | Use Transloco for runtime i18n with lazy loading                |
| [ADR-0003](../../adr/0003-scheduling-integration.md)        | Scheduling Integration        | Proposed | Use Cal.com for consultation booking                            |
| [ADR-0004](../../adr/0004-analytics-solution.md)            | Analytics Solution            | Proposed | Use Plausible Analytics (EU-hosted, GDPR compliant)             |
| [ADR-0005](../../adr/0005-landing-page-architecture.md)     | Landing Page Architecture     | Proposed | Feature-based architecture with smart/presentational separation |

## Decision Summary

| Area                   | Decision                             | ADR Reference |
| ---------------------- | ------------------------------------ | ------------- |
| Internationalization   | Transloco (@jsverse/transloco)       | ADR-0002      |
| Booking/Scheduling     | Cal.com (cloud initially)            | ADR-0003      |
| Analytics              | Plausible Analytics (EU-hosted)      | ADR-0004      |
| Component Architecture | Smart/Presentational pattern         | ADR-0005      |
| State Management       | Angular Signals (no NgRx needed)     | ADR-0005      |
| Content Management     | JSON files per language              | ADR-0005      |
| Styling                | SCSS + BEM + CSS custom properties   | ADR-0005      |
| Routing                | Language prefix pattern (/de/, /en/) | ADR-0005      |

## Key Trade-offs Accepted

### Transloco over Angular i18n

- **Accepting:** Slightly larger bundle size (~8-40KB), smaller community
- **Gaining:** Runtime language switching, lazy loading, better DX, modern Signals support

### Cal.com over Calendly

- **Accepting:** Less polished UX, smaller market presence
- **Gaining:** Open-source flexibility, generous free tier, self-hosting option, better API

### Plausible over Google Analytics

- **Accepting:** Less detailed analytics, paid service
- **Gaining:** No cookie consent needed, EU hosting, GDPR compliance, minimal performance impact

### Smart/Presentational Architecture over Simple Components

- **Accepting:** More files and structure overhead
- **Gaining:** Better testability, clearer separation of concerns, reusable presentational components

## Technology Stack Summary

```
Frontend:
├── Angular 21 (existing)
├── Transloco (i18n)
├── Angular Signals (state)
├── SCSS + BEM (styling)
└── Plausible (analytics)

Integrations:
├── Cal.com (booking embed)
└── TBD Newsletter service

Backend (future):
├── NestJS (existing)
├── Prisma (existing)
└── Lead/contact management
```

## Open Items Requiring Further Decision

1. **Newsletter service** - Mailchimp, ConvertKit, or custom backend solution?
2. **Resource hosting** - Where to host downloadable PDFs?
3. **Brand identity** - Colors, fonts, logo design
4. **Domain strategy** - Subdomain vs path-based language URLs
