# User Stories: Backend Lead Management

## Epic

**Title:** Backend Lead Management
**Description:** Implement backend services and database storage for capturing leads from the landing page, including newsletter subscriptions and contact inquiries.
**Business Value:** Securely persist user data to build a marketing audience and ensure no business inquiries are lost.

## User Stories

### Story 1: Newsletter Subscription API

**Priority:** High
**As a** system
**I want** to validate and store newsletter subscriptions
**So that** I can build a mailing list.

**Acceptance Criteria:**

- [x] POST `/api/leads/newsletter` endpoint exists.
- [x] Validates email format.
- [x] Checks if email is already subscribed (idempotent or error).
- [x] Stores email, consent timestamp, and source (e.g., 'landing-page').
- [x] Returns 201 Created on success.
- [x] Returns 400 Bad Request on invalid data.

### Story 2: Contact Form API

**Priority:** Medium
**As a** system
**I want** to store contact form messages
**So that** the consultant can follow up with inquiries.

**Acceptance Criteria:**

- [x] POST `/api/leads/contact` endpoint exists.
- [x] Validates name, email, and message.
- [x] Stores inquiry in the database.
- [x] Returns 201 Created on success.

### Story 3: Lead Storage Schema

**Priority:** High
**As a** developer
**I want** a robust database schema for leads
**So that** data is consistent and queryable.

**Acceptance Criteria:**

- [x] `NewsletterSubscriber` model defined in Prisma.
- [x] `ContactInquiry` model defined in Prisma.
- [x] Migrations applied to the database.

## Technical Tasks

1. Update `prisma/schema.prisma` with new models.
2. Generate Prisma client.
3. Create `LeadsModule` in NestJS.
4. Implement `LeadsController` and `LeadsService`.
5. Add DTOs with `class-validator`.
6. Add unit tests for Service and Controller.
