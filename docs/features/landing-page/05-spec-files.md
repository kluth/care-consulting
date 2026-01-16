# Spec Files: Care Consulting Landing Page

## Test Files Created

| File                                                                                    | Purpose                                  | Test Count | Status |
| --------------------------------------------------------------------------------------- | ---------------------------------------- | ---------- | ------ |
| `libs/landing/src/lib/components/hero/hero.component.spec.ts`                           | Hero section display and CTA interaction | 12         | Green  |
| `libs/landing/src/lib/components/services/services.component.spec.ts`                   | Services cards rendering and interaction | 16         | Green  |
| `libs/landing/src/lib/components/education/education.component.spec.ts`                 | Webinar and resources display            | 20         | Green  |
| `libs/landing/src/lib/components/testimonials/testimonials.component.spec.ts`           | Testimonials carousel navigation         | 26         | Green  |
| `libs/landing/src/lib/components/about/about.component.spec.ts`                         | Team member information display          | 20         | Green  |
| `libs/landing/src/lib/components/contact/contact.component.spec.ts`                     | Contact info and social links            | 21         | Green  |
| `libs/landing/src/lib/components/booking-widget/booking-widget.component.spec.ts`       | Cal.com embed and error handling         | 23         | Green  |
| `libs/landing/src/lib/components/newsletter-form/newsletter-form.component.spec.ts`     | Email subscription form validation       | 36         | Green  |
| `libs/landing/src/lib/components/language-switcher/language-switcher.component.spec.ts` | i18n language selection                  | 27         | Green  |
| `libs/landing/src/lib/containers/landing-page/landing-page.container.spec.ts`           | Page orchestration and state             | 31         | Green  |
| `libs/landing/src/lib/services/content.service.spec.ts`                                 | Content loading and caching              | 17         | Green  |

**Total Unit Tests:** 249 (All Passing)

## E2E Tests

| File                                  | Purpose                               | Status                                          |
| ------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| `apps/frontend-e2e/src/e2e/app.cy.ts` | Verify full landing page user journey | Green (Partial - Form tests skipped due to env) |

## Coverage Goals

| Category   | Target | Current |
| ---------- | ------ | ------- |
| Statements | 80%    | >80%    |
| Branches   | 80%    | >80%    |
| Functions  | 80%    | >80%    |
| Lines      | 80%    | >80%    |

## Test Scenarios Covered

### HeroComponent

- [x] Display title as h1
- [x] Display subtitle
- [x] Display CTA button
- [x] Emit ctaClick event
- [x] Handle missing content
- [x] Accessibility: heading hierarchy
- [x] Accessibility: button focusable

### ServicesComponent

- [x] Display section title
- [x] Render all service cards
- [x] Display service icons
- [x] Display service features
- [x] Handle empty services
- [x] Handle missing features
- [x] Emit serviceClick event
- [x] Accessibility: h2/h3 hierarchy

### EducationComponent

- [x] Display webinar information
- [x] Format webinar date
- [x] Display resources list
- [x] Show download links
- [x] Handle missing webinar
- [x] Handle missing resources
- [x] Emit registration event
- [x] Emit download event
- [x] Accessibility: datetime element

### TestimonialsComponent

- [x] Display testimonial quote
- [x] Display author info
- [x] Navigation controls (prev/next)
- [x] Indicator dots
- [x] Wrap navigation
- [x] Handle single testimonial
- [x] Handle empty array
- [x] Handle long text
- [x] Accessibility: blockquote, aria-labels

### AboutComponent

- [x] Display team members
- [x] Display credentials
- [x] Display LinkedIn link
- [x] Handle missing photo
- [x] Handle missing credentials
- [x] Accessibility: h2/h3, alt text

### ContactComponent

- [x] Display email with mailto
- [x] Display phone with tel link
- [x] Display address
- [x] Display social links
- [x] Handle missing fields
- [x] Accessibility: address element

### BookingWidgetComponent

- [x] Loading state management
- [x] Error handling with fallback
- [x] Cal.com embed integration
- [x] Retry functionality
- [x] Timeout handling
- [x] Emit events (completed, error)
- [x] Accessibility: loading states

### NewsletterFormComponent

- [x] Email validation (format, required)
- [x] Consent checkbox (required)
- [x] Form submission
- [x] Loading state
- [x] Success state
- [x] Error handling
- [x] Already subscribed handling
- [x] Trim email whitespace
- [x] Prevent double submission
- [x] Accessibility: labels, aria

### LanguageSwitcherComponent

- [x] Display current language
- [x] Dropdown toggle
- [x] Language selection
- [x] Keyboard navigation
- [x] URL update on change
- [x] localStorage persistence
- [x] Accessibility: aria-expanded, listbox

### LandingPageContainer

- [x] Load content on init
- [x] Pass content to children
- [x] Loading skeleton
- [x] Error handling with retry
- [x] Language change handling
- [x] CTA click handling
- [x] Newsletter subscription
- [x] Accessibility landmarks

### ContentService

- [x] Load content by language
- [x] Handle HTTP errors
- [x] Cache management
- [x] Content validation
- [x] Fallback to default language

## Running Tests

```bash
# Run all tests for the landing library
nx test landing

# Run with coverage
nx test landing --coverage

# Run in watch mode during development
nx test landing --watch

# Run single spec file
nx test landing --testFile=hero.component.spec.ts

# Run with verbose output
nx test landing --verbose
```

## Next Steps (Phase 6: Implementation)

1. **Run specs to confirm they fail (Red phase)** ✅
2. **Create component files to make tests pass (Green phase)** ✅
3. **Refactor as needed** ✅
