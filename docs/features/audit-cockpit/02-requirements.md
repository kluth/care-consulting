# Feature Requirements: Audit Cockpit

## Functional Requirements

### Core Requirements (MVP)

| ID         | Requirement              | Acceptance Criteria                                                               |
| ---------- | ------------------------ | --------------------------------------------------------------------------------- |
| **FR-001** | **Audit Templates**      | Admins can define Audit Templates with Sections and Questions.                    |
| **FR-002** | **Self-Audit Execution** | Users can start an audit, answer Yes/No/Not Applicable, and save progress.        |
| **FR-003** | **Scoring Engine (QPR)** | System calculates grades (1.0 - 5.0) based on weighted answers and "KO-Criteria". |
| **FR-004** | **PDF Report**           | Generate a professional "Mock MD Report" summarizing findings.                    |
| **FR-005** | **Course Linking**       | If a question is answered "No" (Fail), suggest relevant Academy courses.          |

### Secondary Requirements

| ID         | Requirement          | Acceptance Criteria                                       |
| ---------- | -------------------- | --------------------------------------------------------- |
| **FR-006** | **Evidence Upload**  | Allow uploading photos/docs as proof for each answer.     |
| **FR-007** | **History/Trends**   | Show grade improvement over time (chart).                 |
| **FR-008** | **Multi-User Audit** | Allow multiple staff to work on one audit simultaneously. |

## Non-Functional Requirements

### Compliance

- **Data Sovereignty:** Audit results are strictly private to the facility.
- **Accuracy:** Scoring logic must match official SGB XI guidelines within 0.1 grade points.

### Usability

- **Mobile Support:** Audits are often done "walking around". UI must be tablet-friendly.

## Data Model (Mental Draft)

- `AuditTemplate` -> `AuditSection` -> `AuditQuestion`
- `AuditRun` (Instance) -> `AuditAnswer`

## Edge Cases

- **Regulatory Change:** Old audits must remain viewable even if the Template is updated. (Versioned Templates).
- **Incomplete Audits:** Scoring should handle "in progress" states (e.g., "Provisional Grade").
