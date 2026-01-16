# ADR-0017: Fortbildung Reminder System

## Status

Accepted

## Date

2026-01-16

## Context

The Fortbildungsmanager needs to remind care workers of upcoming continuing education deadlines. Reminders must be reliable, reach users even when not actively using the platform, and support multiple notification channels (email, push, in-app).

## Research Findings

### Option 1: Server-side Scheduled Jobs (NestJS + Bull/Agenda)

**Sources researched:**

- [NestJS Schedule Documentation](https://docs.nestjs.com/techniques/task-scheduling)
- [Bull Queue for Node.js](https://docs.bullmq.io/)

**Pros:**

- Reliable delivery regardless of client state
- Can schedule jobs far in advance
- Works with email providers (SendGrid, Mailgun)
- Audit trail of sent notifications
- Handles retries and failures gracefully

**Cons:**

- Requires queue infrastructure (Redis for Bull)
- More server-side complexity
- Push notifications still need client-side setup

**Community sentiment:**
Industry standard for scheduled notifications. Bull with Redis is the most popular choice for NestJS.

### Option 2: Push Notifications Only (Service Worker)

**Sources researched:**

- [Angular Push Notifications Guide](https://blog.angular-university.io/angular-push-notifications/)
- [Angular.dev Push Notifications](https://angular.dev/ecosystem/service-workers/push-notifications)

**Pros:**

- Native mobile-like experience
- Works when browser is closed
- No email infrastructure needed
- Real-time delivery

**Cons:**

- Requires user permission (can be denied)
- Not supported on all browsers (Safari limitations)
- Cannot reach users who haven't granted permission
- Less reliable than email for critical reminders

**Community sentiment:**
Best used as a complement to email, not a replacement. Great for real-time alerts, less reliable for scheduled reminders.

### Option 3: Email-only with Cron Jobs

**Pros:**

- Simplest to implement
- Universal reach (everyone has email)
- No client-side setup needed

**Cons:**

- Email can end up in spam
- No immediate visibility for users
- Less engaging than push notifications

**Community sentiment:**
Reliable but dated. Modern systems use multi-channel approaches.

## Decision

We will use **Option 1: Server-side Scheduled Jobs** with a **multi-channel notification strategy**:

1. **Primary: Email** (via existing email service)
   - Sent at 90, 60, 30, and 7 days before deadline
   - HTML templates with clear CTAs
   - Always delivered (no permission needed)

2. **Secondary: Push Notifications** (via Angular Service Worker + Web Push)
   - Real-time alerts for users who opt in
   - Same schedule as email
   - Rich notifications with action buttons

3. **Tertiary: In-App Notifications**
   - Dashboard banner for urgent deadlines (<30 days)
   - Bell icon with notification count
   - Persistent until acknowledged

### Technical Implementation

- Use `@nestjs/schedule` for cron jobs
- Use `@nestjs/bull` with Redis for queued notifications
- Store notification preferences per user
- Track delivery status for compliance reporting

## Rationale

Research shows SMS has 98% open rates but email is more appropriate for formal compliance reminders. Push notifications provide immediacy but cannot be the sole channel. A multi-channel approach ensures maximum reach while respecting user preferences.

## Consequences

### Positive

- High delivery reliability through multiple channels
- User preference support
- Audit trail for compliance
- Scalable queue-based architecture

### Negative

- Requires Redis infrastructure
- More complex notification logic
- Need to manage multiple templates

### Risks

- Email deliverability (spam filters)
- Mitigation: Use reputable email service, implement SPF/DKIM/DMARC
- Push notification permission denial
- Mitigation: Clear value proposition, graceful fallback to email

## References

- [Angular Push Notifications](https://angular.dev/ecosystem/service-workers/push-notifications)
- [Appointment Reminders Guide](https://acuityscheduling.com/learn/appointment-reminders-guide)
- ADR-0009: Real-time Communication (existing Socket.io infrastructure)
