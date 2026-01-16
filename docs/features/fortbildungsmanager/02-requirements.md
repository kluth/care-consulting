# Feature Requirements: Fortbildungsmanager

## Functional Requirements

### Core Requirements (Must Have)

| ID         | Requirement                       | Acceptance Criteria                                                                                   |
| ---------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **FR-001** | **Personal Education Tracking**   | Users can view their current continuing education status (hours completed, hours remaining, deadline) |
| **FR-002** | **Automatic Hour Calculation**    | System calculates hours based on user role (16h/2yr or 24h/yr for Praxisanleiter)                     |
| **FR-003** | **Course Completion Recognition** | Completing platform courses automatically credits hours to user's profile                             |
| **FR-004** | **External Training Entry**       | Users can manually log external training with title, provider, date, hours, and upload proof          |
| **FR-005** | **Deadline Reminders**            | Automatic email/push reminders at 90, 60, 30, and 7 days before deadline                              |
| **FR-006** | **Certificate Generation**        | Generate PDF certificates with QR code for completed training periods                                 |
| **FR-007** | **QR Verification**               | Public endpoint to verify certificate authenticity via QR code scan                                   |
| **FR-008** | **Team Compliance Dashboard**     | PDL/Managers see overview of all team members' compliance status                                      |
| **FR-009** | **MDK Report Export**             | One-click export of compliance report for entire facility (PDF + Excel)                               |
| **FR-010** | **Role-based Requirements**       | Different hour requirements for Pflegefachkraft vs Praxisanleiter                                     |

### Secondary Requirements (Should Have)

| ID         | Requirement                          | Acceptance Criteria                                                       |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------- |
| **FR-011** | **Praxisanleiter Category Tracking** | Track pedagogical vs. professional hours separately (min 12h pedagogical) |
| **FR-012** | **Training Provider Directory**      | Searchable list of recognized training providers                          |
| **FR-013** | **Bulk User Import**                 | Import team members via CSV with their current status                     |
| **FR-014** | **Historical Records**               | View past compliance periods and certificates                             |
| **FR-015** | **Manager Notifications**            | Alert PDL when team members are at risk of non-compliance                 |

### Nice to Have (Could Have)

| ID         | Requirement                       | Acceptance Criteria                                  |
| ---------- | --------------------------------- | ---------------------------------------------------- |
| **FR-020** | **Training Recommendations**      | AI-powered suggestions based on gaps and preferences |
| **FR-021** | **Team Training Planning**        | Schedule team trainings and track attendance         |
| **FR-022** | **Integration with Pflegekammer** | Automatic submission to state nursing chambers       |
| **FR-023** | **Multi-Facility Support**        | Organization-level view across multiple facilities   |

## Non-Functional Requirements

### Performance

- Dashboard loads in <2 seconds
- Report generation completes in <10 seconds for facilities up to 500 employees
- QR verification responds in <500ms

### Security

- Certificate verification tokens are cryptographically signed (JWT/HMAC)
- Only authorized managers can view team compliance data
- External training uploads scanned for malware
- GDPR-compliant data handling for personal training records

### Accessibility

- WCAG 2.1 AA compliance
- Screen reader support for dashboard
- Mobile-responsive design for on-the-go access

### Compatibility

- Works on tablets (common in care facilities)
- Offline capability for viewing own status
- PDF certificates compatible with standard readers

## Constraints

- Must comply with § 132 SGB V and PflBG requirements
- Certificate format should align with Pflegekammer expectations
- German language primary, English secondary
- Must integrate with existing Auth0 user system

## Edge Cases

| Scenario                                 | Expected Behavior                                          |
| ---------------------------------------- | ---------------------------------------------------------- |
| User role changes mid-cycle              | Recalculate requirements, preserve completed hours         |
| User joins mid-compliance period         | Pro-rate requirements based on start date                  |
| External training uploaded without proof | Mark as "pending verification" until proof added           |
| Course hours exceed period requirement   | Cap at requirement, carry-over not allowed per regulations |
| User leaves organization                 | Archive records, certificates remain verifiable            |
| Leap year affecting 2-year cycles        | Use exact date math, not year approximation                |
| Training date in the future              | Reject entry, training must be completed                   |
| Duplicate training entry                 | Warn user, allow override with justification               |

## Open Questions

- [x] Multi-facility support scope? → Phase 2 (Secondary)
- [ ] Integration with specific Pflegekammer APIs? → Research needed
- [ ] Carry-over rules for excess hours? → Per regulations: No carry-over
