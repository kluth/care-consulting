# User Stories: Gamification

## Epic: Core Gamification Engine

### Story 1: XP & Leveling Logic

**As a** User
**I want** to earn XP for completing lessons and passing quizzes
**So that** I feel a sense of progression.

**Acceptance Criteria:**

- [ ] Database schema tracks `xp` and `level` on User model.
- [ ] `GamificationService.addXp(userId, amount, source)` method exists.
- [ ] Level is recalculated automatically when XP increases (e.g., Level = sqrt(XP) or fixed tiers).
- [ ] Event listeners trigger XP awards (e.g., `LessonCompletedEvent`).

### Story 2: Badge System

**As a** User
**I want** to earn badges for specific milestones
**So that** I can show off my achievements.

**Acceptance Criteria:**

- [ ] `Badge` and `UserBadge` database models.
- [ ] System checks for badge triggers (e.g., "First Course Completed").
- [ ] Badges have an icon URL and description.

## Epic: Certificates

### Story 3: Certificate Generation

**As a** User
**I want** to download a PDF certificate upon course completion
**So that** I have proof of my training.

**Acceptance Criteria:**

- [ ] Endpoint `GET /api/certificates/:courseId` generates a PDF.
- [ ] PDF contains: User Name, Course Title, Completion Date, Verification ID.
- [ ] PDF is signed/secured (backend generation).

### Story 4: Certificate Verification

**As a** Facility Manager
**I want** to verify a certificate's authenticity
**So that** I know the training is valid.

**Acceptance Criteria:**

- [ ] Public endpoint/page `/verify/:certificateId`.
- [ ] Shows "Valid" status and course details if ID exists.

## Epic: Frontend UI

### Story 5: Profile Gamification Display

**As a** User
**I want** to see my Level, XP Bar, and Badges on my profile
**So that** I know where I stand.

**Acceptance Criteria:**

- [ ] User Profile component displays current Level.
- [ ] Progress bar shows % to next level.
- [ ] Grid of earned badges is displayed.

### Story 6: Leaderboard Widget

**As a** User
**I want** to see the top 10 students
**So that** I am motivated to compete.

**Acceptance Criteria:**

- [ ] Dashboard widget showing "Top Learners".
- [ ] Shows User Name (or masked name), Level, and XP.
