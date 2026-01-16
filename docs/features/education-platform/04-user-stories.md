# User Stories: Education Platform

## Epic

**Title:** Education Platform
**Description:** A comprehensive learning management system for care consulting.
**Business Value:** Monetize knowledge through scalable courses.

## Related ADRs

- [ADR-0006](../../adr/0006-authentication-provider.md) (Auth0)
- [ADR-0007](../../adr/0007-video-hosting-strategy.md) (Mux)
- [ADR-0008](../../adr/0008-live-course-delivery.md) (Zoom Links)
- [ADR-0009](../../adr/0009-realtime-communication.md) (Socket.io)
- [ADR-0010](../../adr/0010-payment-gateway.md) (Stripe)

## User Stories

### Story 1: User Authentication (Auth0 Integration)

**Priority:** High (Must Have)
**Story Points:** 5
**As a** visitor
**I want** to sign up and log in
**So that** I can access my purchased courses.

**Acceptance Criteria:**

- [ ] User clicks "Login/Signup" and is redirected to Auth0 Universal Login.
- [ ] After login, user is redirected back to the dashboard.
- [ ] User profile data (from Auth0) is stored/synced to our PostgreSQL DB (via Webhook or login hook).
- [ ] User sees "My Profile" in the header.

---

### Story 2: Browse Course Catalog

**Priority:** High
**Story Points:** 3
**As a** visitor
**I want** to browse available courses
**So that** I can choose what to learn.

**Acceptance Criteria:**

- [ ] Public "/courses" page lists all published courses.
- [ ] Filter by Type (Live, On-Demand).
- [ ] Click course to view detailed "Sales Page" (Curriculum, Price, Instructor).

---

### Story 3: Purchase Course (Stripe)

**Priority:** High
**Story Points:** 8
**As a** student
**I want** to pay for a course
**So that** I can gain access.

**Acceptance Criteria:**

- [ ] Click "Enroll Now" -> Redirect to Stripe Checkout.
- [ ] Complete payment -> Redirect to "Thank You" / Course Dashboard.
- [ ] Backend receives Stripe Webhook -> Grants "ENROLLED" status in DB.
- [ ] User receives email receipt (from Stripe).

---

### Story 4: View On-Demand Course (Video Player)

**Priority:** High
**Story Points:** 8
**As a** student
**I want** to watch the course videos
**So that** I can learn the material.

**Acceptance Criteria:**

- [ ] Course Player UI displays video (Mux Player) and curriculum sidebar.
- [ ] Video playback tracks progress (e.g., mark as "watched" after 90%).
- [ ] unauthorized users cannot access the video URL directly.

---

### Story 5: Access Live Sessions

**Priority:** Medium
**Story Points:** 3
**As a** student
**I want** to see the schedule and join links for live sessions
**So that** I don't miss the live training.

**Acceptance Criteria:**

- [ ] "Live Sessions" tab in course view.
- [ ] Upcoming sessions listed with Date/Time (local timezone).
- [ ] "Join via Zoom" button appears 15 mins before start.

---

### Story 6: Course Chat (Socket.io)

**Priority:** Medium
**Story Points:** 5
**As a** student
**I want** to chat with my cohort
**So that** we can discuss the topic.

**Acceptance Criteria:**

- [ ] Real-time chat widget in the course sidebar.
- [ ] Messages persist in history.
- [ ] Only enrolled students can chat.

---

### Story 7: Admin Course Management

**Priority:** High
**Story Points:** 8
**As an** admin
**I want** to create and edit courses
**So that** I can update the catalog.

**Acceptance Criteria:**

- [ ] Admin dashboard -> "Create Course".
- [ ] Upload video (sends to Mux).
- [ ] Set Title, Description, Price.
- [ ] Publish/Unpublish toggle.

## Story Map

| Priority | Story            | Dependencies |
| -------- | ---------------- | ------------ |
| 1        | S1: Auth         | -            |
| 2        | S7: Admin Mgmt   | S1           |
| 3        | S2: Catalog      | S7           |
| 4        | S3: Purchase     | S1, S2       |
| 5        | S4: Video Player | S3, S7       |
| 6        | S5: Live Access  | S3           |
| 7        | S6: Chat         | S3           |

## Technical Stories

### Tech Story 1: Setup Mux Integration

- Install Mux Node SDK.
- Create MuxService in NestJS.
- Webhook handler for "video.ready".

### Tech Story 2: Setup Stripe Integration

- Install Stripe SDK.
- Create Checkout Session API.
- Webhook handler for "checkout.session.completed".

### Tech Story 3: Setup Socket.io Gateway

- Create ChatGateway in NestJS.
- Define events (joinRoom, sendMessage).
