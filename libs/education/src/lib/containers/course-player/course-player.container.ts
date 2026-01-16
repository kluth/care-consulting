import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { ChatWidgetComponent } from '../../components/chat-widget/chat-widget.component';
import { CourseService, Course } from '../../services/course.service';

interface Lesson {
  id: string;
  title: string;
  duration?: number;
  muxPlaybackId?: string;
  order: number;
  completed?: boolean;
}

interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

@Component({
  selector: 'education-course-player',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoPlayerComponent, ChatWidgetComponent],
  template: `
    <div class="course-player">
      <aside class="course-player__sidebar">
        <a routerLink="/academy/courses" class="back-link">&larr; Zurück zu Kursen</a>

        <h2>{{ course()?.title }}</h2>

        <nav class="lesson-list">
          @for (lesson of lessons(); track lesson.id; let i = $index) {
            <button
              class="lesson-item"
              [class.active]="currentLessonIndex() === i"
              [class.completed]="lesson.completed"
              (click)="selectLesson(i)"
            >
              <span class="lesson-item__number">{{ i + 1 }}</span>
              <span class="lesson-item__title">{{ lesson.title }}</span>
              @if (lesson.duration) {
                <span class="lesson-item__duration">
                  {{ formatDuration(lesson.duration) }}
                </span>
              }
              @if (lesson.completed) {
                <span class="lesson-item__check">✓</span>
              }
            </button>
          }
        </nav>
      </aside>

      <main class="course-player__main">
        @if (currentLesson(); as lesson) {
          @if (lesson.muxPlaybackId) {
            <education-video-player
              [playbackId]="lesson.muxPlaybackId"
              (completed)="onLessonComplete()"
            />
          } @else {
            <div class="no-video">
              <p>Dieses Kapitel enthält kein Video.</p>
            </div>
          }

          <div class="lesson-info">
            <h1>{{ lesson.title }}</h1>
            <div class="lesson-actions">
              @if (currentLessonIndex() > 0) {
                <button class="btn btn--secondary" (click)="previousLesson()">
                  &larr; Vorheriges Kapitel
                </button>
              }
              @if (currentLessonIndex() < lessons().length - 1) {
                <button class="btn btn--primary" (click)="nextLesson()">
                  Nächstes Kapitel &rarr;
                </button>
              } @else {
                <button class="btn btn--success" (click)="completeCourse()">
                  Kurs abschließen ✓
                </button>
              }
            </div>
          </div>
        }
      </main>

      <aside class="course-player__chat">
        <education-chat-widget [courseId]="courseId()" [username]="userName()" />
      </aside>
    </div>
  `,
  styles: [`
    .course-player {
      display: grid;
      grid-template-columns: 280px 1fr 300px;
      min-height: 100vh;
      background: var(--color-background, #f7fafc);
    }

    .course-player__sidebar {
      background: white;
      border-right: 1px solid var(--color-border, #e2e8f0);
      padding: 1.5rem;
      overflow-y: auto;
      max-height: 100vh;
      position: sticky;
      top: 0;
    }

    .back-link {
      display: block;
      margin-bottom: 1.5rem;
      color: var(--color-primary, #1a365d);
      text-decoration: none;
      font-size: 0.875rem;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .course-player__sidebar h2 {
      font-size: 1.125rem;
      margin: 0 0 1.5rem 0;
      color: var(--color-text-primary, #1a202c);
    }

    .lesson-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .lesson-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      background: transparent;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 0.375rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }

    .lesson-item:hover {
      border-color: var(--color-primary, #1a365d);
    }

    .lesson-item.active {
      background: var(--color-primary-light, #ebf8ff);
      border-color: var(--color-primary, #1a365d);
    }

    .lesson-item.completed {
      background: #f0fff4;
    }

    .lesson-item__number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: var(--color-background, #f7fafc);
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .lesson-item__title {
      flex: 1;
      font-size: 0.875rem;
      color: var(--color-text-primary, #1a202c);
    }

    .lesson-item__duration {
      font-size: 0.75rem;
      color: var(--color-text-secondary, #4a5568);
    }

    .lesson-item__check {
      color: #38a169;
      font-weight: bold;
    }

    .course-player__main {
      padding: 0;
    }

    .no-video {
      aspect-ratio: 16/9;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a202c;
      color: white;
    }

    .lesson-info {
      padding: 1.5rem;
    }

    .lesson-info h1 {
      font-size: 1.5rem;
      margin: 0 0 1rem 0;
      color: var(--color-text-primary, #1a202c);
    }

    .lesson-actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .btn--primary {
      background: var(--color-primary, #1a365d);
      color: white;
    }

    .btn--secondary {
      background: var(--color-background, #f7fafc);
      color: var(--color-text-primary, #1a202c);
      border: 1px solid var(--color-border, #e2e8f0);
    }

    .btn--success {
      background: #38a169;
      color: white;
    }

    .course-player__chat {
      background: white;
      border-left: 1px solid var(--color-border, #e2e8f0);
      position: sticky;
      top: 0;
      max-height: 100vh;
      overflow: hidden;
    }

    @media (max-width: 1024px) {
      .course-player {
        grid-template-columns: 1fr;
      }

      .course-player__sidebar,
      .course-player__chat {
        display: none;
      }
    }
  `],
})
export class CoursePlayerContainer implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  user = toSignal(this.authService.user$);
  userName = computed(() => this.user()?.name || 'User');

  course = signal<CourseWithLessons | null>(null);
  currentLessonIndex = signal(0);

  courseId = computed(() => this.route.snapshot.paramMap.get('courseId') || '');
  lessons = computed(() => this.course()?.lessons || []);
  currentLesson = computed(() => this.lessons()[this.currentLessonIndex()] || null);

  ngOnInit(): void {
    const courseId = this.courseId();
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  loadCourse(id: string): void {
    this.courseService.getCourse(id).subscribe({
      next: (course) => {
        this.course.set(course as CourseWithLessons);
      },
    });
  }

  selectLesson(index: number): void {
    this.currentLessonIndex.set(index);
  }

  previousLesson(): void {
    const current = this.currentLessonIndex();
    if (current > 0) {
      this.currentLessonIndex.set(current - 1);
    }
  }

  nextLesson(): void {
    const current = this.currentLessonIndex();
    if (current < this.lessons().length - 1) {
      this.currentLessonIndex.set(current + 1);
    }
  }

  onLessonComplete(): void {
    // Mark lesson as completed
    const lessons = this.lessons();
    const currentIndex = this.currentLessonIndex();
    if (lessons[currentIndex]) {
      lessons[currentIndex].completed = true;
    }

    // Auto-advance to next lesson
    if (currentIndex < lessons.length - 1) {
      setTimeout(() => this.nextLesson(), 1500);
    }
  }

  completeCourse(): void {
    // Mark course as completed
    console.log('Course completed!');
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
