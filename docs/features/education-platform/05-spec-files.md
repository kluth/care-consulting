# Spec Files: Education Platform

## Test Files Created

| File                                                                                | Purpose               | Test Count | Status |
| ----------------------------------------------------------------------------------- | --------------------- | ---------- | ------ |
| `libs/education/src/lib/components/course-catalog/course-catalog.component.spec.ts` | Browse/Filter courses | 10         | Red    |
| `libs/education/src/lib/components/course-detail/course-detail.component.spec.ts`   | View details/Purchase | 12         | Red    |
| `libs/education/src/lib/components/video-player/video-player.component.spec.ts`     | Video playback logic  | 8          | Red    |
| `libs/education/src/lib/components/chat-widget/chat-widget.component.spec.ts`       | Real-time chat UI     | 10         | Red    |
| `libs/education/src/lib/services/course.service.spec.ts`                            | Course data fetching  | 8          | Red    |
| `apps/backend/src/app/education/courses.service.spec.ts`                            | Backend CRUD logic    | 10         | Red    |

## Coverage Goals

- Statements: 80%
- Branches: 80%

## Test Scenarios

### CourseCatalogComponent

- [ ] Render list of courses
- [ ] Filter by category
- [ ] Handle empty state
- [ ] Navigate to detail on click

### VideoPlayerComponent

- [ ] Initialize Mux player with playbackId
- [ ] Emit 'completed' event on finish
- [ ] Handle playback errors

### ChatWidgetComponent

- [ ] Connect to socket on init
- [ ] Display incoming messages
- [ ] Send message on submit
- [ ] Handle disconnect
