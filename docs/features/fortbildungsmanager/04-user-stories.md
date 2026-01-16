# User Stories: Fortbildungsmanager

## Epic

**Title:** Fortbildungsmanager - Continuing Education Compliance
**Description:** A comprehensive system for tracking, managing, and verifying continuing education requirements for German care workers, ensuring MDK audit compliance.
**Business Value:** Reduces compliance violations, saves administrative time, and provides audit-ready documentation at the click of a button.

## User Stories

### Story 1: View Personal Education Status

**Priority:** High
**Story Points:** 5

As a **Pflegefachkraft (care worker)**
I want **to see my continuing education progress at a glance**
So that **I know how many hours I still need and when my deadline is**

**Acceptance Criteria:**

- [ ] Given I am logged in, when I navigate to "Meine Fortbildungen", then I see a progress bar showing completed vs required hours
- [ ] Given I am a regular Pflegefachkraft, when I view my status, then the requirement shows 16h/2yr
- [ ] Given I am a Praxisanleiter, when I view my status, then the requirement shows 24h/yr with pedagogical breakdown
- [ ] Given my deadline is <30 days away, when I view my status, then I see a warning indicator

**Technical Notes:**

- Use signals for reactive status updates
- Cache compliance status, invalidate on new training entry

---

### Story 2: Log Platform Course Completion

**Priority:** High
**Story Points:** 3

As a **care worker**
I want **my completed platform courses to automatically count toward my continuing education hours**
So that **I don't have to manually track internal training**

**Acceptance Criteria:**

- [ ] Given I complete a course on the platform, when the course has CE hours assigned, then those hours are automatically added to my Fortbildung record
- [ ] Given hours are added, when I view my education log, then I see the course with title, date, and hours
- [ ] Given a course has no CE hours, when I complete it, then no Fortbildung entry is created

**Technical Notes:**

- Hook into existing course completion event
- Courses need `ceHours` and `ceCategory` fields

**Dependencies:**

- Existing course completion system

---

### Story 3: Log External Training

**Priority:** High
**Story Points:** 5

As a **care worker**
I want **to manually log training I attended outside the platform**
So that **all my continuing education is tracked in one place**

**Acceptance Criteria:**

- [ ] Given I click "Externe Fortbildung hinzufügen", when I fill in title, provider, date, hours, and category, then the entry is saved
- [ ] Given I submit without required fields, when validation runs, then I see specific error messages
- [ ] Given I upload a certificate/proof document, when saved, then the document is attached to the entry
- [ ] Given the training date is in the future, when I try to save, then I see an error "Training must be completed"

**Technical Notes:**

- File upload via existing document service
- Categories: "Fachlich", "Pädagogisch", "Sonstige"

---

### Story 4: Receive Deadline Reminders

**Priority:** High
**Story Points:** 5

As a **care worker**
I want **to receive reminders before my continuing education deadline**
So that **I don't miss my compliance deadline**

**Acceptance Criteria:**

- [ ] Given my deadline is 90 days away, when the scheduled job runs, then I receive an email reminder
- [ ] Given reminders are enabled, when 60, 30, and 7 days remain, then I receive additional reminders
- [ ] Given I have push notifications enabled, when a reminder is due, then I also receive a push notification
- [ ] Given I completed my hours, when reminder is scheduled, then no reminder is sent

**Technical Notes:**

- Bull queue for scheduling
- Respect user notification preferences

---

### Story 5: Generate Compliance Certificate

**Priority:** High
**Story Points:** 8

As a **care worker**
I want **to generate an official certificate for my completed continuing education period**
So that **I can provide proof to my employer or MDK auditors**

**Acceptance Criteria:**

- [ ] Given I have completed my required hours, when I click "Zertifikat generieren", then a PDF is generated
- [ ] Given a certificate is generated, when I view the PDF, then it contains my name, period, total hours, and a QR code
- [ ] Given the QR code is scanned, when visited, then a verification page shows the certificate is valid
- [ ] Given I have not completed my hours, when I try to generate a certificate, then I see "Stunden noch nicht erfüllt"

**Technical Notes:**

- Use PDFKit (ADR-0012)
- RS256 JWT in QR URL (ADR-0016)
- Store certificate record in database

---

### Story 6: Verify Certificate via QR Code

**Priority:** High
**Story Points:** 3

As an **MDK auditor**
I want **to scan a certificate QR code and see verification status**
So that **I can quickly confirm the certificate is authentic**

**Acceptance Criteria:**

- [ ] Given I scan a valid QR code, when the page loads, then I see "Zertifikat gültig" with certificate details
- [ ] Given the certificate was revoked, when I scan, then I see "Zertifikat ungültig"
- [ ] Given the QR code is tampered with, when verification runs, then I see "Verifizierung fehlgeschlagen"
- [ ] Given I access the verification page, when not logged in, then verification still works (public endpoint)

**Technical Notes:**

- Public route, no auth required
- Verify JWT signature server-side

---

### Story 7: View Team Compliance Dashboard

**Priority:** High
**Story Points:** 8

As a **Pflegedienstleitung (nursing director)**
I want **to see an overview of my team's continuing education compliance**
So that **I can identify at-risk employees and prepare for MDK audits**

**Acceptance Criteria:**

- [ ] Given I am a PDL, when I open the team dashboard, then I see a list of all team members with their compliance status
- [ ] Given a team member is <30 days from deadline with incomplete hours, when I view the list, then they are highlighted in red
- [ ] Given I filter by status, when I select "At Risk", then only non-compliant members are shown
- [ ] Given I click on a team member, when the detail opens, then I see their full education history

**Technical Notes:**

- Requires PDL role check
- Pagination for large teams

**Dependencies:**

- User role system with PDL designation

---

### Story 8: Export MDK Compliance Report

**Priority:** High
**Story Points:** 5

As a **facility manager**
I want **to export a comprehensive compliance report for my facility**
So that **I am prepared for MDK audits**

**Acceptance Criteria:**

- [ ] Given I click "MDK Report exportieren", when generation completes, then I can download a PDF report
- [ ] Given the report is generated, when I open it, then it contains all employees, their hours, and compliance status
- [ ] Given I select a date range, when I generate, then only training within that period is included
- [ ] Given I also want raw data, when I click "Excel Export", then I get an XLSX file

**Technical Notes:**

- PDFKit for PDF
- ExcelJS for XLSX
- Async generation for large facilities

---

### Story 9: Praxisanleiter Category Tracking

**Priority:** Medium
**Story Points:** 5

As a **Praxisanleiter**
I want **to see my pedagogical vs. professional hours separately**
So that **I know if I'm meeting the 12h minimum pedagogical requirement**

**Acceptance Criteria:**

- [ ] Given I am a Praxisanleiter, when I view my status, then I see two progress bars (pedagogical / professional)
- [ ] Given I log training, when I select category "Pädagogisch", then it counts toward my 12h minimum
- [ ] Given I have 12h+ pedagogical and 24h+ total, when I generate certificate, then it notes both requirements met

**Technical Notes:**

- `category` field on training entries
- Validation logic for Praxisanleiter role

---

### Story 10: Manager Compliance Alerts

**Priority:** Medium
**Story Points:** 3

As a **PDL**
I want **to receive alerts when team members are at risk of non-compliance**
So that **I can intervene proactively**

**Acceptance Criteria:**

- [ ] Given a team member reaches 60 days to deadline with <50% hours, when the check runs, then I receive an email alert
- [ ] Given I receive an alert, when I open it, then I see the employee name and recommended action
- [ ] Given I want to disable alerts, when I update preferences, then alerts stop

**Technical Notes:**

- Separate notification preferences for managers
- Weekly digest option

---

## Story Map

| Priority | Story                              | Dependencies           |
| -------- | ---------------------------------- | ---------------------- |
| 1        | Story 1: View Personal Status      | None                   |
| 2        | Story 3: Log External Training     | Story 1                |
| 3        | Story 2: Log Platform Courses      | Story 1, Course system |
| 4        | Story 4: Deadline Reminders        | Story 1                |
| 5        | Story 5: Generate Certificate      | Story 1                |
| 6        | Story 6: QR Verification           | Story 5                |
| 7        | Story 7: Team Dashboard            | Story 1, User roles    |
| 8        | Story 8: MDK Report Export         | Story 7                |
| 9        | Story 9: Praxisanleiter Categories | Story 1                |
| 10       | Story 10: Manager Alerts           | Story 7, Story 4       |

## Technical Stories

### Tech Story 1: Fortbildung Database Schema

Add Prisma models for FortbildungEntry, FortbildungPeriod, FortbildungCertificate

### Tech Story 2: Bull Queue Setup

Configure Bull with Redis for scheduled notification jobs

### Tech Story 3: RSA Key Management

Set up RSA key pair for certificate signing, implement key rotation strategy
