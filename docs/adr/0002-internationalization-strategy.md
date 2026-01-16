# ADR-0002: Internationalization Strategy

## Status

Proposed

## Date

2026-01-14

## Context

The landing page requires multi-language support (German, English, and future European languages) with the ability to switch languages at runtime without page reloads. Users should be able to change languages dynamically, and the architecture should support future language additions.

## Research Findings

### Option 1: Angular Built-in i18n (@angular/localize)

**Sources researched:**

- [Phrase: Best Angular Libraries for i18n](https://phrase.com/blog/posts/best-libraries-for-angular-i18n/)
- [Medium: Angular i18n - Picking the right tool](https://medium.com/holisticon-consultants/angular-i18n-picking-the-right-tool-for-the-job-b543460801db)

**Pros (from research):**

- Official Angular support, well-documented and maintained
- Better for SEO and marginally better performance
- Great for large teams with dedicated translators
- Compile-time translations reduce runtime overhead

**Cons (from research):**

- Does not support dynamic language switching - requires rebuilding for different locales
- No lazy loading of translations - all included at build time
- Multiple bundles mean page reload when switching languages
- Larger bundle sizes when all languages are compiled in

**Community sentiment:**
Best suited for static sites with known languages at build time; not ideal for dynamic language switching.

### Option 2: ngx-translate

**Sources researched:**

- [CodeAndWeb: ngx-translate Tutorial](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular-app-with-ngx-translate)
- [npm-compare: i18n library comparison](https://npm-compare.com/@ngx-translate/core,@ngneat/transloco,angular-i18n)

**Pros (from research):**

- Runtime localization with dynamic language switching
- Simple JSON files for translations
- ~720k weekly downloads - very established
- Works well with standalone components
- Supports lazy-loading of translation files

**Cons (from research):**

- Development was stagnant for over a year (recently resumed)
- Managing many translation files can become complex
- May experience performance issues with large translation files
- Extra setup required for SSR with Angular Universal

**Community sentiment:**
Well-established but concerns about maintenance. Considered by many to be superseded by Transloco.

### Option 3: Transloco (@jsverse/transloco)

**Sources researched:**

- [Phrase: Best Angular Libraries for i18n](https://phrase.com/blog/posts/best-libraries-for-angular-i18n/)
- [Lokalise: Angular localization with Transloco](https://lokalise.com/blog/angular-localization-with-transloco/)
- [Netanel Basal: Introducing Transloco](https://medium.com/netanelbasal/introducing-transloco-angular-internationalization-done-right-54710337630c)

**Pros (from research):**

- Described as "the successor to ngx-translate" and "best runtime library currently available"
- Excellent developer experience with great documentation
- Built-in lazy loading of translations
- Modern Angular Signals support
- Compatible with state management (NgRx, Akita)
- Migration schematic available from ngx-translate
- Well-maintained with active development
- Plugin architecture for MessageFormat and L10n

**Cons (from research):**

- Smaller user base (~90k weekly downloads vs 720k for ngx-translate)
- Core package 8kB, up to 40kB with all plugins
- Newer library, less community examples than ngx-translate

**Community sentiment:**
Highly recommended for new projects; considered the modern choice for Angular i18n with runtime switching needs.

## Decision

We will use **Transloco (@jsverse/transloco)** for internationalization.

## Rationale

Based on research findings and our specific requirements:

1. **Runtime language switching** is required - users should change languages without page reload
2. **Future language additions** - architecture must support adding languages without code changes
3. **Modern Angular compatibility** - Transloco supports Signals and modern patterns
4. **Developer experience** - Well-documented with excellent DX
5. **Performance** - Built-in lazy loading means only needed translations are loaded
6. **Active maintenance** - Unlike ngx-translate's period of stagnation, Transloco is actively developed
7. **Migration path** - If ever needed, easy migration tools exist

## Consequences

### Positive

- Seamless runtime language switching improves UX
- Lazy loading reduces initial bundle size
- Plugin architecture allows future expansion (pluralization, date formatting)
- Well-maintained with predictable updates
- Good testing utilities included

### Negative

- Smaller community than ngx-translate means fewer Stack Overflow answers
- Additional dependency (~8-40kB depending on plugins)
- Team needs to learn Transloco-specific patterns

### Risks

- Library could lose momentum (mitigated by active development and corporate backing)
- Migration path from Transloco if needed is less documented than from ngx-translate

## References

- [Transloco Documentation](https://jsverse.gitbook.io/transloco/)
- [Phrase: Best Angular i18n Libraries](https://phrase.com/blog/posts/best-libraries-for-angular-i18n/)
- [npm trends comparison](https://npmtrends.com/@ngneat/transloco-vs-@ngx-translate/core-vs-angular-i18n-vs-angular-l10n)
