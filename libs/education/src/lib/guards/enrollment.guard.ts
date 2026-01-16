import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';

export const enrollmentGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const enrollmentService = inject(EnrollmentService);
  const router = inject(Router);

  const courseId = route.paramMap.get('courseId');

  if (!courseId) {
    router.navigate(['/courses']);
    return of(false);
  }

  return auth.isAuthenticated$.pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        auth.loginWithRedirect({
          appState: { target: router.url },
        });
        return of(false);
      }

      return enrollmentService.isEnrolled(courseId).pipe(
        map((isEnrolled) => {
          if (isEnrolled) {
            return true;
          }

          // Redirect to course purchase page
          router.navigate(['/courses', courseId]);
          return false;
        }),
        catchError(() => {
          router.navigate(['/courses']);
          return of(false);
        })
      );
    })
  );
};
