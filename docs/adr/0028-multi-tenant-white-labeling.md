# ADR-0028: Multi-Tenant White-Labeling System

## Status

Proposed

## Date

2026-02-03

## Context

Large care groups and franchise facilities want their own branding (logos, colors) on the platform to maintain brand consistency for their employees.

## Decision

Implement **Multi-Tenant White-Labeling** with:

1. **Theming Engine (CSS Variables)**
   - Dynamic CSS variable injection based on the facility context.
   - Facility-specific logos and splash screens.

2. **Custom Domain Support**
   - Support for `academy.facility-name.com`.
   - Dynamic SSL termination via reverse proxy (e.g., Caddy/Nginx).

3. **Tenant-Specific Content**
   - Ability for facilities to add their own internal training material alongside global courses.

## Rationale

White-labeling is a high-value B2B feature that increases the platform's attractiveness to large healthcare providers and professional associations.

## Consequences

### Positive
- High enterprise appeal.
- Brand alignment for customers.
- Scalable multi-tenancy.

### Negative
- Increased frontend complexity.
- Testing across different themes required.
- Infrastructure complexity for custom domains.
