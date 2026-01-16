# Feature Requirements: Care Consulting Landing Page

## Functional Requirements

### Core Requirements (Must Have)

| ID     | Requirement                         | Acceptance Criteria                                                                                                                    |
| ------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | Hero section with value proposition | Given a visitor lands on the page, when the page loads, then the value proposition is visible within the viewport without scrolling    |
| FR-002 | Primary CTA: Book consultation      | Given a visitor clicks "Book Consultation", when Calendly/Cal.com widget loads, then user can select available time slots              |
| FR-003 | Services overview section           | Given a visitor scrolls to services, when they view the section, then all 3 service categories are clearly displayed with descriptions |
| FR-004 | Educational content section         | Given a visitor views educational section, when displayed, then webinar signup and resource download options are visible               |
| FR-005 | Multi-language support (DE/EN)      | Given a visitor selects a language, when toggled, then all content updates to selected language without page reload                    |
| FR-006 | Contact information display         | Given a visitor looks for contact info, when they scroll to footer/contact, then email, phone, and address are visible                 |
| FR-007 | Legal pages: Impressum              | Given a visitor clicks Impressum link, when page loads, then all legally required business information is displayed                    |
| FR-008 | Legal pages: Datenschutzerklärung   | Given a visitor clicks Privacy link, when page loads, then GDPR-compliant privacy policy is displayed                                  |
| FR-009 | Legal pages: AGB                    | Given a visitor clicks Terms link, when page loads, then terms and conditions are displayed                                            |
| FR-010 | Newsletter signup form              | Given a visitor enters email, when they submit the form, then email is captured and confirmation shown                                 |
| FR-011 | Mobile responsive design            | Given a visitor uses a mobile device, when viewing the page, then all content is accessible and properly formatted                     |
| FR-012 | Content from JSON/Markdown files    | Given content needs to change, when JSON/Markdown files are edited, then the site reflects updates after rebuild                       |

### Secondary Requirements (Should Have)

| ID     | Requirement                     | Acceptance Criteria                                                                                                         |
| ------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| FR-020 | Testimonials section            | Given a visitor views testimonials, when section loads, then quotes from clients are displayed with attributions            |
| FR-021 | About/Team section              | Given a visitor wants to learn about the team, when viewing about section, then founder/team info and credentials are shown |
| FR-022 | Trust indicators                | Given a visitor evaluates credibility, when viewing the page, then certifications, client logos, or statistics are visible  |
| FR-023 | Resource download (lead magnet) | Given a visitor wants a free resource, when they provide email, then PDF/guide is delivered and lead captured               |
| FR-024 | Webinar registration            | Given a visitor wants to attend webinar, when they register, then they receive confirmation and calendar invite             |
| FR-025 | Blog/Articles preview           | Given a visitor seeks educational content, when viewing blog section, then latest articles with teasers are shown           |

### Nice to Have (Could Have)

| ID     | Requirement             | Acceptance Criteria                                                                                  |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| FR-030 | Dark mode toggle        | Given a visitor prefers dark mode, when toggled, then entire page switches to dark theme             |
| FR-031 | Animated scroll effects | Given a visitor scrolls, when sections come into view, then subtle animations enhance the experience |
| FR-032 | Live chat widget        | Given a visitor has questions, when clicking chat, then they can interact with support/chatbot       |
| FR-033 | Additional languages    | Given a visitor needs another language, when selected, then content displays in French/Spanish/etc.  |
| FR-034 | Cookie consent banner   | Given analytics require consent, when visitor arrives, then GDPR-compliant consent banner appears    |

## Non-Functional Requirements

### Performance

- First Contentful Paint (FCP) < 1.5 seconds
- Largest Contentful Paint (LCP) < 2.5 seconds
- Time to Interactive (TTI) < 3 seconds
- Cumulative Layout Shift (CLS) < 0.1
- Total page weight < 500KB (excluding images)
- Images optimized with WebP/AVIF format and lazy loading

### Security

- HTTPS only
- Content Security Policy headers
- No inline scripts (for CSP compliance)
- XSS protection through Angular's built-in sanitization
- CORS configured for API calls
- Rate limiting on form submissions (backend)

### Accessibility (WCAG 2.1 AA)

- All images have alt text
- Color contrast ratio minimum 4.5:1
- Keyboard navigation support
- Focus indicators visible
- Screen reader compatible
- Skip to main content link
- Proper heading hierarchy (h1 -> h2 -> h3)
- Form labels properly associated
- Error messages clear and accessible

### Compatibility

- Modern browsers: Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile: iOS Safari, Chrome for Android
- Screen sizes: 320px to 2560px
- Progressive enhancement for older browsers

### SEO

- Semantic HTML structure
- Meta tags for title, description, keywords
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD) for organization and services
- XML sitemap generation
- Canonical URLs
- Multi-language hreflang tags

### Internationalization (i18n)

- Use Angular's built-in i18n or ngx-translate
- Language detection from browser/URL
- URL structure: `/de/`, `/en/`, etc.
- RTL support architecture (for future Arabic/Hebrew)
- Date, number, currency localization
- Language switcher in header

## Constraints

### Technical Constraints

- Must use existing Angular 21 + Nx workspace
- Must integrate with existing UI library in `libs/ui`
- Must use TypeScript strict mode
- Must follow existing ESLint and Prettier configuration
- Must maintain >80% test coverage
- Components should be built in Storybook first

### Business Constraints

- Initial launch targeting German market
- Must comply with German legal requirements (Impressum, etc.)
- GDPR compliance mandatory
- Privacy-focused analytics (no Google Analytics tracking without consent)

### Design Constraints

- Modern & innovative aesthetic
- Professional yet approachable
- Brand identity needs to be established
- Must work with future brand guidelines

## Edge Cases

| Scenario                         | Expected Behavior                                                                |
| -------------------------------- | -------------------------------------------------------------------------------- |
| User has JavaScript disabled     | Essential content visible via SSR/pre-rendering, booking CTA shows fallback link |
| User has slow connection         | Skeleton loaders shown, images lazy load, critical CSS inlined                   |
| Booking service unavailable      | Fallback to email contact form with appropriate message                          |
| Invalid email in newsletter form | Clear error message, field highlighted, no submission                            |
| User switches language mid-form  | Form data preserved, labels update to new language                               |
| Screen reader user navigating    | All interactive elements announced, landmarks defined                            |
| User on 320px screen             | All content accessible, navigation collapses to hamburger                        |
| Very long testimonial text       | Text truncated with "read more" expansion                                        |
| Missing content in JSON file     | Graceful fallback or build-time error for required fields                        |

## Open Questions

1. **Booking integration**: Cal.com (open source) vs Calendly (proprietary) - needs research
2. **Newsletter service**: Which email marketing platform to integrate?
3. **Resource hosting**: Where to host downloadable PDFs/guides?
4. **Domain/hosting**: Custom domain, hosting provider decisions
5. **Brand colors**: Need to establish color palette
6. **Logo design**: External designer or AI-generated starting point?

## Technical Architecture Preview

```
apps/
  frontend/
    src/
      app/
        pages/
          landing/           # Landing page components
          legal/             # Impressum, Datenschutz, AGB
        shared/
          i18n/              # Translation files and service
          content/           # JSON content files

libs/
  ui/                        # Shared UI components
  shared/
    types/                   # Shared interfaces
    content/                 # Content loading utilities
```
