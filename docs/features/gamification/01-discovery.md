# Feature Discovery: Gamification

## Date

2026-01-16

## Initial Idea

Implement a comprehensive gamification system to boost user engagement, motivation, and course completion rates. This includes a full suite of mechanics: points, badges, levels, leaderboards (various scopes), and official certification.

## Problem Statement

- **Engagement:** Online courses often suffer from low completion rates due to lack of motivation.
- **Retention:** Users need reasons to return to the platform daily/weekly beyond just "content".
- **Validation:** Caregivers and facilities need tangible proof of skills and progress (Certificates/Levels).
- **Competition:** B2B clients (facilities) benefit from friendly competition to drive staff training compliance.

## Target Users

1.  **Students/Caregivers (B2C/B2B):** Primary users earning rewards.
2.  **Care Facilities (B2B):** Managers monitoring facility-level leaderboards and progress.
3.  **Administrators:** Managing badges, certificate templates, and validity.

## Key Components (The "All of them" Scope)

1.  **Points (XP) System:** Earned via granular actions (login, watch video, pass quiz).
2.  **Badges/Achievements:** Visual milestones (e.g., "Early Bird", "Quiz Whiz", "Streak Master").
3.  **Leveling System:** Progression tiers (e.g., Level 1-50, Ranks like "Novice" -> "Expert").
4.  **Leaderboards:**
    - Global (All users)
    - National / Local (Geographic)
    - Facility-level (Private to a specific organization)
5.  **Certificates:**
    - Auto-generated PDF upon course completion.
    - **Constraint:** Must investigate validity/accreditation for "Official" status (CNE points).

## Success Criteria (Metrics)

1.  **Course Completion Rate:** Target increase of 20%.
2.  **Daily Active Users (DAU):** Increase in login frequency due to "streak" mechanics.
3.  **Time on Platform:** Increased engagement per session.
4.  **Certificate Downloads:** Number of verified completions.
5.  **Leaderboard Engagement:** Percentage of users checking rankings.

## Related Existing Features

- **Auth0:** User identity for tracking progress.
- **Courses/Lessons:** The core content triggering gamification events.
- **Video (Mux):** Watch events to trigger XP.
- **User Profile:** Home for badges and level display.

## Initial Questions/Concerns

- **Official Certificates:** How do we verify identity and accreditation for "official" certificates? Do we need third-party validation?
- **Performance:** Real-time leaderboard calculations can be expensive. Need an efficient strategy (e.g., Redis).
- **Privacy:** B2B users might not want to appear on Global leaderboards. (Default to private/facility-only?).
