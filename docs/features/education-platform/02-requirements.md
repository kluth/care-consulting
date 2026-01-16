# Feature Requirements: Education Platform

## Functional Requirements

### Core Requirements (Must Have)

| ID     | Requirement            | Acceptance Criteria                                                                                            |
| ------ | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| FR-001 | User Authentication    | Users can sign up, log in, and manage their profile. Secure session management.                                |
| FR-002 | Course Catalog         | Users can browse available live and on-demand courses with filtering.                                          |
| FR-003 | Course Purchase        | Users can purchase courses or bundles via a payment gateway.                                                   |
| FR-004 | On-Demand Video Player | Users can watch paid course videos securely (preventing unauthorized sharing).                                 |
| FR-005 | Live Course Access     | Users can access live sessions (e.g., via integrated Zoom/Jitsi or secure links) for courses they enrolled in. |
| FR-006 | Course Materials       | Users can download PDF slides, worksheets, and other resources attached to courses.                            |
| FR-007 | Discussion Forum       | Users can post questions and comments in a course-specific forum.                                              |
| FR-008 | Real-time Chat         | Users can chat with other course participants (e.g., in a cohort).                                             |
| FR-009 | Assignments            | Users can submit assignments (text/file) and receive feedback/grades.                                          |
| FR-010 | Admin Dashboard        | Admin can create courses, upload videos, schedule live sessions, and manage users.                             |

### Secondary Requirements (Should Have)

| ID     | Requirement       | Acceptance Criteria                                       |
| ------ | ----------------- | --------------------------------------------------------- |
| FR-011 | Progress Tracking | Users see their completion status for videos and courses. |
| FR-012 | Certificates      | Users receive a certificate upon course completion.       |
| FR-013 | Bundles/Packages  | Users can buy "Consulting + Education" packages.          |

### Nice to Have (Could Have)

| ID     | Requirement         | Acceptance Criteria                               |
| ------ | ------------------- | ------------------------------------------------- |
| FR-014 | Quizzes             | Automated quizzes to test knowledge.              |
| FR-015 | Mobile Offline Mode | Download videos for offline viewing (Mobile App). |

## Non-Functional Requirements

### Performance

- Video playback must adapt to bandwidth (HLS/DASH).
- Chat must be near real-time (< 500ms latency).

### Security

- **Auth:** Secure password handling (if custom) or reputable provider. MFA support desirable.
- **Video:** Signed URLs or token-based access to prevent hotlinking/sharing.
- **Payments:** PCI-DSS compliance (via Stripe Elements/Checkout).

### Accessibility

- Video player must support captions/subtitles.
- Chat and Forum must be screen-reader accessible.

## Constraints

- **Budget:** Minimize monthly SaaS costs where possible, but prioritize dev speed.
- **Stack:** Angular (Frontend), NestJS (Backend), Prisma (ORM), PostgreSQL.

## Edge Cases

| Scenario               | Expected Behavior                                |
| ---------------------- | ------------------------------------------------ |
| Payment Failure        | User is notified, access is not granted.         |
| Live Stream disconnect | Reconnection logic, fallback to recording later. |
| Video Service downtime | Graceful error message.                          |

## Open Decisions (To be resolved via ADRs)

1.  **Authentication Provider:** Build vs Buy (Auth0, Clerk, Firebase, etc.)?
2.  **Video Hosting:** Platform for paid content (Vimeo, Mux, Cloudflare)?
3.  **Live Platform:** Integration depth (SDK vs Link) and Provider (Zoom, Daily, Jitsi)?
4.  **Real-time Tech:** Socket.io vs Managed Service (Pusher, Stream)?
5.  **Payment Gateway:** Stripe?
