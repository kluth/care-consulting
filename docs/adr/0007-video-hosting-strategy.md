# ADR-0007: Video Hosting Strategy for Paid Courses

## Status

Proposed

## Date

2026-01-15

## Context

We need to host paid course videos. YouTube is not suitable as it's hard to prevent sharing. We need a solution that prevents unauthorized downloading/sharing and provides adaptive streaming (HLS).

## Research Findings

### Option 1: YouTube (Unlisted)

- **Pros:** Free, familiar player.
- **Cons:** Easy to share links, ads/branding, no API for "course progress" tracking (native).

### Option 2: Vimeo (Pro/Business)

- **Pros:** Privacy controls (domain restriction), easy management UI.
- **Cons:** Player customization is limited, "Vimeo" branding can persist.

### Option 3: Mux / Cloudflare Stream

- **Pros:** Developer-first, white-label, pay-as-you-go, secure signed URLs, highly customizable player.
- **Cons:** Requires building the upload/management UI ourselves.

## Decision

We will use **Mux**.

## Rationale

Mux offers the best balance of developer control and video quality. It allows us to build a completely white-labeled "Academy" experience without Vimeo branding. It supports signed URLs for security and webhooks for tracking processing status.

## Consequences

- **Positive:** Professional, seamless video playback.
- **Negative:** We must build the "Upload Video" UI in our Admin Dashboard.
