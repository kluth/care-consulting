# Spec Files: Fortbildungsmanager

## Test Files to Create

| File                                                                                  | Purpose                               | Test Count | Status  |
| ------------------------------------------------------------------------------------- | ------------------------------------- | ---------- | ------- |
| `libs/fortbildung/src/lib/services/fortbildung.service.spec.ts`                       | Core business logic                   | 15+        | Pending |
| `libs/fortbildung/src/lib/services/certificate.service.spec.ts`                       | Certificate generation & verification | 10+        | Pending |
| `libs/fortbildung/src/lib/services/reminder.service.spec.ts`                          | Reminder scheduling logic             | 8+         | Pending |
| `libs/fortbildung/src/lib/components/status-card/status-card.component.spec.ts`       | Personal status display               | 8+         | Pending |
| `libs/fortbildung/src/lib/components/training-form/training-form.component.spec.ts`   | External training entry               | 10+        | Pending |
| `libs/fortbildung/src/lib/components/team-dashboard/team-dashboard.component.spec.ts` | Manager dashboard                     | 12+        | Pending |
| `apps/backend/src/app/fortbildung/fortbildung.service.spec.ts`                        | Backend service                       | 15+        | Pending |
| `apps/backend/src/app/fortbildung/fortbildung.controller.spec.ts`                     | API endpoints                         | 12+        | Pending |

## Coverage Goals

| Category   | Target |
| ---------- | ------ |
| Statements | 90%    |
| Branches   | 85%    |
| Functions  | 90%    |
| Lines      | 90%    |

## Key Test Scenarios

### FortbildungService (Frontend)

- [x] Calculate hours remaining for Pflegefachkraft (16h/2yr)
- [x] Calculate hours remaining for Praxisanleiter (24h/yr)
- [x] Track pedagogical vs professional hours separately
- [x] Handle pro-rated requirements for mid-period joiners
- [x] Determine compliance status (compliant, at-risk, non-compliant)

### CertificateService

- [x] Generate certificate only when requirements met
- [x] Include QR code with signed verification token
- [x] Verify valid certificates
- [x] Reject tampered certificates
- [x] Handle revoked certificates

### ReminderService

- [x] Schedule reminders at correct intervals (90, 60, 30, 7 days)
- [x] Skip reminders for compliant users
- [x] Respect user notification preferences
- [x] Handle timezone differences

### StatusCardComponent

- [x] Display progress bar correctly
- [x] Show warning for <30 days remaining
- [x] Display different requirements based on role
- [x] Handle loading and error states

### TeamDashboardComponent

- [x] Only accessible to PDL role
- [x] Filter by compliance status
- [x] Sort by deadline
- [x] Pagination for large teams
- [x] Export functionality

## Running Tests

```bash
# Run all fortbildung tests
nx test fortbildung

# Run with coverage
nx test fortbildung --coverage

# Run backend tests
nx test backend --testFile=fortbildung

# Run in watch mode
nx test fortbildung --watch
```
