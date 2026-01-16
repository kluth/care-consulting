import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
  enrolledAt: string;
  expiresAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/enrollments';

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/me`);
  }

  isEnrolled(courseId: string): Observable<boolean> {
    return this.http.get<{ enrolled: boolean }>(`${this.apiUrl}/check/${courseId}`).pipe(
      map((response) => response.enrolled)
    );
  }

  getEnrollment(courseId: string): Observable<Enrollment | null> {
    return this.http.get<Enrollment | null>(`${this.apiUrl}/course/${courseId}`);
  }
}
