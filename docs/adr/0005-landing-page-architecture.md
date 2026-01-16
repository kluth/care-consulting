# ADR-0005: Landing Page Component Architecture

## Status

Proposed

## Date

2026-01-14

## Context

We need to define the component architecture for the landing page feature, including how to structure components, manage state, load content, and organize the feature module within the existing Nx workspace.

## Decision

### Component Structure

We will use a **feature-based architecture** with smart/presentational component separation:

```
libs/
  landing/                         # New feature library
    src/
      lib/
        components/
          hero/                    # Hero section (presentational)
          services/                # Services overview (presentational)
          education/               # Education section (presentational)
          testimonials/            # Testimonials carousel (presentational)
          about/                   # About/team section (presentational)
          contact/                 # Contact info (presentational)
          booking-widget/          # Cal.com embed wrapper (smart)
          newsletter-form/         # Newsletter signup (smart)
          language-switcher/       # i18n toggle (smart)
        containers/
          landing-page/            # Page container (smart)
        services/
          content.service.ts       # Content loading from JSON
        models/
          content.model.ts         # Content type definitions
        landing.routes.ts          # Feature routes
        index.ts                   # Public API

  shared/
    content/                       # Shared content utilities
      src/
        lib/
          i18n/                    # Translation files (de.json, en.json)
          content/                 # JSON content files
          services/
            content-loader.service.ts
```

### Smart vs Presentational Components

| Component                 | Type           | Responsibility                                |
| ------------------------- | -------------- | --------------------------------------------- |
| LandingPageContainer      | Smart          | Orchestrates data loading, manages page state |
| HeroComponent             | Presentational | Displays hero content via @Input()            |
| ServicesComponent         | Presentational | Displays services via @Input()                |
| EducationComponent        | Presentational | Displays education content via @Input()       |
| TestimonialsComponent     | Presentational | Displays testimonials via @Input()            |
| AboutComponent            | Presentational | Displays team/about via @Input()              |
| ContactComponent          | Presentational | Displays contact info via @Input()            |
| BookingWidgetComponent    | Smart          | Manages Cal.com embed lifecycle               |
| NewsletterFormComponent   | Smart          | Manages form state, API submission            |
| LanguageSwitcherComponent | Smart          | Manages language selection with Transloco     |

### State Management

For a landing page with minimal interactivity, we will use:

- **Angular Signals** for component-level state
- **Transloco** for language state (built-in state management)
- **No NgRx** - overkill for static content display

If future requirements demand complex state (e.g., multi-step forms, user authentication), we can introduce NgRx SignalStore.

### Content Management

Content will be loaded from JSON/Markdown files:

```typescript
// content/de/landing.json
{
  "hero": {
    "title": "Professionelle Pflegeberatung",
    "subtitle": "Qualitätsmanagement · Schulungen · Prozessoptimierung",
    "cta": "Beratungstermin vereinbaren"
  },
  "services": [...]
}
```

Content files are loaded at build time and bundled, but structured for easy editing.

### Routing Strategy

```typescript
// landing.routes.ts
export const landingRoutes: Routes = [
  { path: '', component: LandingPageContainer },
  { path: 'impressum', component: ImpressumPage },
  { path: 'datenschutz', component: DatenschutzPage },
  { path: 'agb', component: AgbPage },
];

// app.routes.ts
export const appRoutes: Routes = [
  {
    path: ':lang',
    children: [
      {
        path: '',
        loadChildren: () => import('@care-consulting/landing').then((m) => m.landingRoutes),
      },
    ],
  },
  { path: '', redirectTo: '/de', pathMatch: 'full' },
];
```

### Styling Strategy

- **SCSS** with CSS custom properties for theming
- **BEM methodology** for class naming
- **Mobile-first** responsive design
- Design tokens in `libs/ui/src/styles/tokens/`

## Consequences

### Positive

- Clear separation of concerns
- Easy testing of presentational components
- Content editable without code changes
- Feature library can be lazy-loaded
- Consistent with existing libs/ui structure

### Negative

- More files than a monolithic approach
- Requires understanding of smart/presentational pattern

### Risks

- Over-engineering for a simple landing page (acceptable for maintainability)

## References

- [Angular Architecture Patterns](https://angular.io/guide/architecture)
- [Smart vs Presentational Components](https://blog.angular-university.io/angular-2-smart-components-vs-presentation-components-whats-the-difference-when-to-use-each-and-why/)
