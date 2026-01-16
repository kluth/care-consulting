# Feature Discovery: Care Consulting Landing Page

## Date

2026-01-14

## Initial Idea

A landing page for a care consulting business targeting the German care sector (with future expansion to Europe), offering both B2B consulting services for care facilities and B2C educational content including workshops and courses.

## Problem Statement

Care facilities in Germany face challenges with quality management, staff development, and operational efficiency. Individual caregivers need accessible professional development opportunities. There is no centralized platform to connect these audiences with expert consulting and educational resources.

## Target Users

### Primary Audience 1: Care Facilities (B2B)

- Nursing homes (Pflegeheime)
- Hospitals and clinics
- Home care agencies (Ambulante Pflegedienste)
- Care facility management and leadership
- Quality management officers

### Primary Audience 2: Individual Caregivers (B2C)

- Professional caregivers (Pflegefachkräfte)
- Care assistants (Pflegehelfer)
- People entering the care profession
- Team leaders and ward managers
- Care facility owners and entrepreneurs

## Business Offering

### Consulting Services (B2B)

1. **Quality Management** - MDK audit preparation, quality assurance systems, documentation optimization
2. **Staff Training & Development** - In-house training programs, team development, leadership coaching
3. **Operational Consulting** - Process optimization, digitalization strategy, efficiency improvements

### Educational Content (B2C)

- Free webinars as lead magnets
- Downloadable resources and guides
- Future expansion to online courses and live workshops

## Success Criteria

1. Clear value proposition visible within 5 seconds of landing
2. Primary CTA (Book a consultation) prominent and accessible
3. Multi-language support (German + English initially, expandable)
4. Professional, modern & innovative design aesthetic
5. Mobile-responsive experience
6. Accessible to all users (WCAG 2.1 AA compliance)
7. Fast page load times (<3s)
8. Lead capture mechanism for newsletter/webinar signups

## Related Existing Features

- Angular 21 frontend application exists in `apps/frontend`
- UI component library exists in `libs/ui`
- NestJS backend with Prisma ORM available for future CRM/lead management
- Storybook integration for component development

## Initial Questions/Concerns

1. What CMS strategy for content management (headless CMS vs. static content)?
2. Calendar/booking integration for consultations (Calendly, Cal.com, custom)?
3. Payment integration needed for future courses?
4. Newsletter/email marketing integration (Mailchimp, ConvertKit, etc.)?
5. Analytics requirements (Google Analytics, Plausible, custom)?
6. SEO strategy and meta tag management
7. Legal requirements: Impressum, Datenschutzerklärung, Cookie consent

## Brand Direction

- **Style**: Modern & innovative
- **Target feel**: Forward-thinking, professional, yet approachable
- **Colors**: To be defined (suggesting bold contemporary palette)
- **Typography**: Clean, modern sans-serif
- **Logo**: Needs to be created

## Language Strategy

- German (primary)
- English (secondary)
- Framework for additional European languages (future)
- i18n architecture required from the start
