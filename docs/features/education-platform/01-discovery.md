# Feature Discovery: Education Platform

## Date

2026-01-15

## Initial Idea

Extend the app with an educational part including live courses, educational material, group works, and courses on demand.

## Problem Statement

Care facilities and individual caregivers need professional development and training. Currently, the site offers consulting, but scaling education through a dedicated platform would provide more value and revenue streams.

## Target Users

- Individual Caregivers (B2C)
- Care Facilities (B2B) - Managers purchasing for staff
- The Consultant (Admin/Instructor)

## Success Criteria

- Users can browse and purchase courses (live and on-demand).
- Users can access course materials (video, PDF).
- Users can participate in group works/discussions.
- Admin can manage course content and schedule live sessions.

## Related Existing Features

- Landing Page (promotes education)
- Authentication (will need to be expanded/integrated)
- Payment/Booking (Cal.com is used for consulting, might need Stripe/etc. for courses)

## Initial Questions/Concerns

1.  **Live Courses Platform:** Integration with Zoom/Teams or embedded video?
2.  **On-Demand Hosting:** Where are videos hosted? (YouTube unlisted, Vimeo, Mux, AWS S3?)
3.  **Group Works:** Real-time chat? Forum? Assignments?
4.  **Auth/User Profile:** We need full user accounts now (currently just leads).
5.  **Payment:** How to handle payments?
