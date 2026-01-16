# User Stories: Care Consulting Landing Page

## Epic

**Title:** Care Consulting Landing Page
**Description:** Build a multi-language landing page for a care consulting business targeting German care facilities and individual caregivers, featuring consultation booking, service information, and educational content promotion.
**Business Value:** Establish online presence, generate leads through consultation bookings and newsletter signups, and position the business as a professional care consulting authority.

## User Stories

---

### Story 1: View Value Proposition (Hero Section)

**Priority:** High (Must Have)
**Story Points:** 3

As a **visitor**
I want **to immediately understand what the business offers**
So that **I can decide within seconds if this is relevant to me**

**Acceptance Criteria:**

- [x] Given I land on the page, when it loads, then I see a compelling headline within the viewport
- [x] Given I view the hero, when displayed, then a brief subtitle explains the core services
- [x] Given I want to take action, when I look at the hero, then a prominent CTA button is visible
- [x] Given I'm on mobile, when viewing the hero, then all content fits without horizontal scrolling
- [x] Given I use a screen reader, when navigating, then the heading hierarchy starts with h1

**Technical Notes:**

- Hero image/background should be optimized (WebP, lazy loading not needed as above fold)
- Animate-on-load effects should respect `prefers-reduced-motion`
- CTA button scrolls to booking section or opens Cal.com modal

**Dependencies:**

- Content JSON structure defined
- Brand colors established

---

### Story 2: Book a Consultation

**Priority:** High (Must Have)
**Story Points:** 5

As a **potential client (care facility manager or individual caregiver)**
I want **to book a consultation directly from the website**
So that **I can discuss my needs without email back-and-forth**

**Acceptance Criteria:**

- [x] Given I click the booking CTA, when Cal.com widget loads, then I see available time slots
- [x] Given I select a time slot, when I provide my details, then I receive a confirmation
- [x] Given I complete booking, when confirmed, then I receive a calendar invite via email
- [x] Given Cal.com is unavailable, when widget fails to load, then I see a fallback contact form
- [x] Given I'm on mobile, when using the booking widget, then it's fully functional and readable
- [x] Given I use a screen reader, when navigating the widget, then it's accessible

**Technical Notes:**

- Use Cal.com embed widget (not redirect)
- Implement loading state while widget initializes
- Fallback to mailto: link if widget fails
- Track booking conversions in Plausible

**Dependencies:**

- Cal.com account configured
- Availability calendar set up

---

### Story 3: Browse Consulting Services

**Priority:** High (Must Have)
**Story Points:** 3

As a **care facility decision-maker**
I want **to see what consulting services are offered**
So that **I can evaluate if this consultant can address my facility's challenges**

**Acceptance Criteria:**

- [x] Given I scroll to services, when section is visible, then I see three service categories
- [x] Given I view a service card, when reading it, then I understand the value proposition
- [x] Given each service, when displayed, then it has a clear title, description, and visual icon
- [x] Given I want more details, when I click a service, then I see expanded information
- [x] Given I'm on mobile, when viewing services, then cards stack vertically and remain readable

**Technical Notes:**

- Service cards: Quality Management, Staff Training, Operational Consulting
- Consider expandable details or link to dedicated pages (future)
- Icons from icon library or custom SVGs

**Dependencies:**

- Service descriptions in content JSON
- Icon/illustration assets

---

### Story 4: Switch Language

**Priority:** High (Must Have)
**Story Points:** 5

As a **visitor who prefers English (or other language)**
I want **to switch the website language without page reload**
So that **I can consume content in my preferred language seamlessly**

**Acceptance Criteria:**

- [x] Given I click the language switcher, when options appear, then I see DE, EN (and future languages)
- [x] Given I select a new language, when applied, then all content updates instantly
- [x] Given I switch languages, when updated, then the URL reflects the new language (/de/, /en/)
- [x] Given I arrived via a language URL, when page loads, then that language is pre-selected
- [x] Given I have browser language preference, when visiting root URL, then I'm redirected to matching language
- [x] Given I switch mid-form, when filling newsletter form, then my input is preserved

**Technical Notes:**

- Transloco handles language state
- Store language preference in localStorage
- Update `<html lang="">` attribute on switch
- Ensure SEO: hreflang tags for language variants

**Dependencies:**

- Transloco configured
- Translation files (de.json, en.json) created

---

### Story 5: View Educational Content / Webinar Signup

**Priority:** High (Must Have)
**Story Points:** 3

As a **caregiver seeking professional development**
I want **to see educational offerings and sign up for webinars**
So that **I can improve my skills and stay current in the field**

**Acceptance Criteria:**

- [x] Given I scroll to education section, when visible, then I see available webinars/resources
- [x] Given I want to register, when clicking signup, then I'm prompted for my email
- [x] Given I submit registration, when successful, then I receive confirmation message
- [x] Given the webinar is upcoming, when displayed, then date/time is shown in local timezone
- [x] Given I'm on mobile, when viewing education section, then layout is optimized

**Technical Notes:**

- Initial implementation: display upcoming webinar info + email capture
- Future: integrate with webinar platform (Zoom, Webex, etc.)
- Track registrations in Plausible as conversion goal

**Dependencies:**

- Newsletter/lead capture backend or service
- Webinar schedule content

---

### Story 6: Subscribe to Newsletter

**Priority:** Medium (Should Have)
**Story Points:** 3

As a **interested visitor**
I want **to subscribe to a newsletter**
So that **I receive updates, tips, and upcoming event notifications**

**Acceptance Criteria:**

- [x] Given I enter my email, when it's valid, then submit button is enabled
- [x] Given I enter invalid email, when I try to submit, then I see a clear error message
- [x] Given I submit valid email, when successful, then I see a thank you confirmation
- [x] Given I've already subscribed, when submitting same email, then I see appropriate message
- [x] Given GDPR requirements, when signing up, then I see consent checkbox or privacy notice
- [x] Given I use keyboard, when navigating form, then focus states are visible

**Technical Notes:**

- Client-side email validation
- GDPR: explicit consent or clear privacy link
- Store leads for now (implement email service integration later)
- Consider double opt-in for GDPR compliance

**Dependencies:**

- Lead storage mechanism (backend API or local)
- Privacy policy link

---

### Story 7: View Testimonials / Social Proof

**Priority:** Medium (Should Have)
**Story Points:** 3

As a **potential client evaluating credibility**
I want **to see testimonials from previous clients**
So that **I can trust this consultant's expertise and results**

**Acceptance Criteria:**

- [x] Given I scroll to testimonials, when visible, then I see at least 2-3 client quotes
- [x] Given each testimonial, when displayed, then it shows quote, name, and role/company
- [x] Given multiple testimonials, when viewing, then I can navigate between them
- [x] Given long testimonials, when displayed, then text is truncated with "read more" option
- [x] Given I'm on mobile, when viewing testimonials, then carousel/cards are swipeable

**Technical Notes:**

- Carousel or card-based display
- Consider static display initially, carousel as enhancement
- Testimonials stored in content JSON

**Dependencies:**

- Testimonial content (quotes, attributions)

---

### Story 8: View About / Team Information

**Priority:** Medium (Should Have)
**Story Points:** 2

As a **potential client**
I want **to learn about the consultant/team**
So that **I understand their background, credentials, and approach**

**Acceptance Criteria:**

- [x] Given I scroll to about section, when visible, then I see founder/consultant information
- [x] Given the about section, when reading, then credentials and experience are highlighted
- [x] Given a photo exists, when displayed, then a professional image is shown
- [x] Given I'm on mobile, when viewing about section, then layout adjusts appropriately

**Technical Notes:**

- Single consultant initially (expandable to team later)
- Photo + bio format
- Optional: link to LinkedIn or full bio page

**Dependencies:**

- Bio content and photo

---

### Story 9: Access Legal Pages (Impressum, Datenschutz, AGB)

**Priority:** High (Must Have - Legal Requirement)
**Story Points:** 2

As a **German website visitor**
I want **to access legally required pages**
So that **I can verify business legitimacy and understand data handling**

**Acceptance Criteria:**

- [x] Given I look in the footer, when scanning links, then Impressum, Datenschutz, AGB are visible
- [x] Given I click Impressum, when page loads, then all legally required info is displayed
- [x] Given I click Datenschutz, when page loads, then GDPR-compliant privacy policy is shown
- [x] Given I click AGB, when page loads, then terms and conditions are displayed
- [x] Given I switch languages, when viewing legal pages, then they update to selected language

**Technical Notes:**

- Legal pages are separate routes: /de/impressum, /en/imprint, etc.
- Content must be legally reviewed
- Consider structured data for organization

**Dependencies:**

- Legal content (requires legal review/input)

---

### Story 10: View Contact Information

**Priority:** High (Must Have)
**Story Points:** 1

As a **visitor preferring traditional contact**
I want **to find phone, email, and address**
So that **I can reach out through my preferred channel**

**Acceptance Criteria:**

- [x] Given I scroll to contact/footer, when visible, then email address is displayed
- [x] Given I see the email, when I click it, then mailto: opens my email client
- [x] Given phone number is available, when displayed, then it's clickable (tel:)
- [x] Given business address exists, when displayed, then it's formatted properly
- [x] Given I'm on mobile, when clicking phone, then it initiates a call

**Technical Notes:**

- Consider privacy: display email in way that's harder to scrape
- Phone: use tel: link for mobile
- Address: optional Google Maps link

**Dependencies:**

- Contact details confirmed

---

### Story 11: Experience Fast Loading

**Priority:** High (Must Have - NFR)
**Story Points:** 3

As a **visitor on any device/connection**
I want **the page to load quickly**
So that **I don't abandon the site due to slow performance**

**Acceptance Criteria:**

- [x] Given I visit the site, when measuring FCP, then it's under 1.5 seconds
- [x] Given I visit the site, when measuring LCP, then it's under 2.5 seconds
- [x] Given I'm on slow 3G, when images load, then they use lazy loading
- [x] Given the page loads, when measuring CLS, then it's under 0.1
- [x] Given I view the source, when analyzing bundle, then JS is under 200KB (excluding images)

**Technical Notes:**

- Optimize images: WebP, srcset, lazy loading
- Preload critical fonts
- Consider SSR/prerendering for faster initial paint
- Monitor with Lighthouse CI

**Dependencies:**

- Image assets optimized
- Performance budget defined

---

### Story 12: Navigate Accessibly

**Priority:** High (Must Have - NFR)
**Story Points:** 3

As a **visitor using assistive technology**
I want **to navigate the page fully with keyboard and screen reader**
So that **I can access all content regardless of ability**

**Acceptance Criteria:**

- [x] Given I use keyboard only, when pressing Tab, then focus moves logically through the page
- [x] Given I use a screen reader, when navigating, then all content is announced properly
- [x] Given interactive elements, when focused, then visible focus indicators appear
- [x] Given images, when displayed, then alt text describes them meaningfully
- [x] Given form fields, when focused, then labels are announced by screen reader
- [x] Given color contrast, when tested, then all text meets WCAG AA (4.5:1)

**Technical Notes:**

- Skip to main content link
- ARIA landmarks: header, nav, main, footer
- Test with VoiceOver (Mac), NVDA (Windows)
- Run pa11y CI tests

**Dependencies:**

- Existing pa11y-ci configuration

---

## Story Map

| Priority | Story                   | Dependencies               | Points |
| -------- | ----------------------- | -------------------------- | ------ |
| 1        | Hero Section (S1)       | Content JSON, Brand colors | 3      |
| 2        | Language Switching (S4) | Transloco setup            | 5      |
| 3        | Services Section (S3)   | Content, Icons             | 3      |
| 4        | Book Consultation (S2)  | Cal.com account            | 5      |
| 5        | Contact Info (S10)      | Contact details            | 1      |
| 6        | Legal Pages (S9)        | Legal content              | 2      |
| 7        | Education/Webinar (S5)  | Lead capture               | 3      |
| 8        | Newsletter Signup (S6)  | Lead storage               | 3      |
| 9        | Testimonials (S7)       | Testimonial content        | 3      |
| 10       | About Section (S8)      | Bio, photo                 | 2      |
| NFR      | Performance (S11)       | -                          | 3      |
| NFR      | Accessibility (S12)     | -                          | 3      |

**Total Story Points:** 36

---

## Technical Stories

### Tech Story 1: Set up Landing Feature Library

Create Nx library `@care-consulting/landing` with initial structure:

- Generate library: `nx g @nx/angular:library landing`
- Set up feature routes
- Create container and component skeletons
- Configure lazy loading in app routes

### Tech Story 2: Configure Transloco

- Install Transloco: `npm install @jsverse/transloco`
- Set up TranslocoModule in app config
- Create translation files (de.json, en.json)
- Implement language detection from URL/browser
- Add language switcher component

### Tech Story 3: Set up Content Structure

- Define TypeScript interfaces for content models
- Create JSON content files per language
- Implement content loading service
- Configure Webpack/build to include JSON assets

### Tech Story 4: Integrate Cal.com Embed

- Create Cal.com account and configure availability
- Create BookingWidgetComponent wrapping Cal.com embed
- Implement loading states and error handling
- Set up Plausible goal tracking for conversions

### Tech Story 5: Configure Plausible Analytics

- Set up Plausible account
- Add tracking script to index.html
- Configure goals: booking, newsletter signup, webinar registration
- Verify tracking in development

### Tech Story 6: Implement Design System Tokens

- Define color palette (brand colors)
- Create typography scale
- Set up spacing system
- Configure in libs/ui/src/styles/
