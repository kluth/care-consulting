import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { ChatWidgetComponent } from '../chat-widget/chat-widget.component';
import { CourseService, Course } from '../../services/course.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '@auth0/auth0-angular';
import { UiButtonComponent } from '@care-consulting/ui';

@Component({
  selector: 'education-course-detail',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent, ChatWidgetComponent, UiButtonComponent],
  template: `
    @if (course(); as c) {
      <div class="course-detail">
        <div class="header">
          <h1>{{ c.title }}</h1>
          <ui-button variant="primary" (click)="enroll(c)">Jetzt buchen für {{ c.price | currency:'EUR' }}</ui-button>
        </div>
        <div class="content-layout">
          <div class="main-content">
            <education-video-player playbackId="placeholder-id" />
            <p>{{ c.description }}</p>
          </div>
          <div class="sidebar">
            <education-chat-widget [courseId]="c.id" [username]="userName()" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .course-detail {
        padding: 2rem;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    .content-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1rem;
    }
    @media (max-width: 768px) {
      .content-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CourseDetailComponent {
  id = input.required<string>();
  
  private courseService = inject(CourseService);
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);

  user = toSignal(this.authService.user$);
  userName = computed(() => this.user()?.name || 'Gast');

  course = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.courseService.getCourse(id))
    )
  );

  enroll(course: Course) {
    this.paymentService.redirectToCheckout(course.id, course.title, course.price);
  }
}
