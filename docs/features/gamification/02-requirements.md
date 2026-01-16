# Feature Requirements: Gamification & Certificates

## Functional Requirements

### Core Requirements (MVP - Must Have)

| ID         | Requirement           | Acceptance Criteria                                                                                           |
| ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| **FR-001** | **XP Engine**         | System tracks XP for: Login (10xp), Lesson View (50xp), Quiz Pass (100xp), Course Complete (500xp).           |
| **FR-002** | **Level System**      | Users progress through levels (1-50) based on XP thresholds (e.g., Lvl 2 = 500 XP).                           |
| **FR-003** | **Badge System**      | Award badges for specific milestones (e.g., "First Course", "Perfect Quiz Score").                            |
| **FR-004** | **PDF Certificates**  | Auto-generate a PDF upon course completion containing: User Name, Course Title, Date, Unique Verification ID. |
| **FR-005** | **Profile Display**   | User profile shows current Level, XP bar, and earned Badges.                                                  |
| **FR-006** | **Basic Leaderboard** | "Top 10 Students" global leaderboard (weekly reset).                                                          |

### Secondary Requirements (V2 - Should Have)

| ID         | Requirement                  | Acceptance Criteria                                                               |
| ---------- | ---------------------------- | --------------------------------------------------------------------------------- |
| **FR-007** | **Streaks**                  | Track consecutive daily logins. Award bonus XP for 7/30 day streaks.              |
| **FR-008** | **Facility Leaderboards**    | Private leaderboards showing rankings _within_ a B2B facility.                    |
| **FR-009** | **Geo Leaderboards**         | Rankings by City/State (requires user location data).                             |
| **FR-010** | **Certificate Verification** | Public URL `care-consulting.de/verify/{id}` to validate certificate authenticity. |

### Nice to Have (Future)

| ID         | Requirement        | Acceptance Criteria                                                      |
| ---------- | ------------------ | ------------------------------------------------------------------------ |
| **FR-011** | **Social Sharing** | "Share to LinkedIn" button for Badges/Certificates.                      |
| **FR-012** | **Rewards Store**  | Redeem XP for discounts on future courses (ties into Affiliate/Payment). |

## Non-Functional Requirements

### Performance

- XP updates must be near real-time (optimistic UI update).
- Leaderboard queries must be cached (Redis or similar) to prevent DB load.

### Security

- **Anti-Cheat:** Rate limit XP earning (e.g., max 10 "Lesson Views" per minute) to prevent botting.
- **Certificate Integrity:** Certificates must be digitally signed or hash-protected to prevent forgery.

### Compliance (Official Certificates)

- **RbP (Registrierung beruflich Pflegender):** System must support storing "Accreditation IDs" for courses.
- **Data Privacy:** Users must be able to opt-out of public leaderboards (GDPR).

## Edge Cases

| Scenario             | Expected Behavior                                                              |
| -------------------- | ------------------------------------------------------------------------------ |
| User retakes a quiz  | No additional XP for subsequent passes (prevent farming).                      |
| User deletes account | Remove from leaderboards, anonymize certificate data (keep ID for validation). |
| Course updated       | Certificate remains valid for the version taken at the time.                   |

## Open Questions

1.  **Certificate Design:** Do we need a custom design tool, or is a standard HTML-to-PDF template sufficient? (Assumption: Standard template).
2.  **Leaderboard Reset:** Do global leaderboards reset weekly/monthly, or are they all-time? (Suggestion: Weekly for engagement).
