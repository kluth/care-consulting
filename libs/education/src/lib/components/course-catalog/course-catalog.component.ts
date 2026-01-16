import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../services/course.service';
import { PaymentService } from '../../services/payment.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiButtonComponent, UiCardComponent } from '@care-consulting/ui';

@Component({
  selector: 'education-course-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent, UiCardComponent],
  template: `
    <div class="course-grid">
      @for (course of courses(); track course.id) {
        <ui-card>
          <h3 header>
            <a [routerLink]="['/academy/courses', course.id]">{{ course.title }}</a>
          </h3>
          <p>{{ course.description }}</p>
          <div footer class="footer">
            <span class="price">{{ course.price | currency:'EUR' }}</span>
            <ui-button variant="primary" (click)="enroll(course)">Jetzt buchen</ui-button>
          </div>
        </ui-card>
      } @empty {
        <p>No courses available.</p>
      }
    </div>
  `,
  styles: [`
    .course-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    .course-card {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }
    .enroll-btn {
      background-color: var(--color-primary, #1a365d);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }
  `]
})
export class CourseCatalogComponent {
  private courseService = inject(CourseService);
  private paymentService = inject(PaymentService);
  courses = toSignal(this.courseService.getCourses(), { initialValue: [] });

  enroll(course: Course) {
    this.paymentService.redirectToCheckout(course.id, course.title, course.price);
  }
}
