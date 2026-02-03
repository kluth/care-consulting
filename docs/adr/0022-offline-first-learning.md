# ADR-0022: Offline-First Learning Experience (PWA & Background Sync)

## Status

Proposed

## Date

2026-02-03

## Context

Many care facilities have "dead zones" with poor or no Wi-Fi. Learning should not stop when the connection drops. Users need to download content and sync progress once they are back in range.

## Decision

Implement **Offline-First Architecture** with:

1. **Service Workers (Angular PWA)**
   - Cache application shell and static assets.
   - Use `SwUpdate` for seamless background updates.

2. **IndexedDB (via Dexie.js)**
   - Store course content (text, JSON, images) locally.
   - Buffer tracking events (progress, check-ins) during offline periods.

3. **Background Sync API**
   - Automatically push buffered events when connectivity is restored.
   - Implement conflict resolution for multi-device sync.

## Rationale

Ensures high availability in low-connectivity environments, reducing frustration and increasing completion rates.

## Consequences

### Positive
- Reliable learning experience.
- Faster perceived performance (local reads).
- Lower data usage.

### Negative
- Increased development complexity (sync logic).
- Storage limits in browsers.
- Cache invalidation challenges.
