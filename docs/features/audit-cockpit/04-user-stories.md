# User Stories: Audit Cockpit

## Epic: Audit Execution

### Story 1: Start Self-Audit

**As a** Facility Manager (PDL)
**I want** to start a new self-audit based on my facility type (Ambulant/Stationär)
**So that** I can check my compliance status.

**Acceptance Criteria:**

- [ ] Dashboard shows "Start Audit" button.
- [ ] User selects Template (e.g., "Ambulant 2025").
- [ ] `AuditRun` is created in DB.

### Story 2: Answer Questions

**As a** User
**I want** to answer questions section by section
**So that** I don't get overwhelmed.

**Acceptance Criteria:**

- [ ] UI shows current Section and Progress.
- [ ] Questions have Yes/No/NA options.
- [ ] Progress is saved automatically.

### Story 3: View Results & Grade

**As a** User
**I want** to see my calculated "Pflegenote" (Grade)
**So that** I know if I would pass a real inspection.

**Acceptance Criteria:**

- [ ] Summary page shows Overall Grade (1.0 - 5.0).
- [ ] Breakdown by Section.
- [ ] List of "Failed" questions with links to recommended Courses.

## Epic: Reporting

### Story 4: PDF Report

**As a** Manager
**I want** to download a PDF report
**So that** I can present it to my team or boss.

**Acceptance Criteria:**

- [ ] "Download Report" button.
- [ ] PDF follows official MDK layout style.
