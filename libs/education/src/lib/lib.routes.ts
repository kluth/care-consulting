import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { enrollmentGuard } from './guards/enrollment.guard';
import { CourseCatalogComponent } from './components/course-catalog/course-catalog.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const educationRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full',
  },
  {
    path: 'courses',
    component: CourseCatalogComponent,
    title: 'Kurse | Care Consulting Academy',
  },
  {
    path: 'courses/:courseId',
    component: CourseDetailComponent,
    title: 'Kursdetails | Care Consulting Academy',
  },
  {
    path: 'courses/:courseId/learn',
    loadComponent: () =>
      import('./containers/course-player/course-player.container').then(
        (m) => m.CoursePlayerContainer
      ),
    canActivate: [enrollmentGuard],
    title: 'Kurs | Care Consulting Academy',
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
    title: 'Mein Profil | Care Consulting Academy',
  },
  {
    path: 'wellness',
    loadComponent: () => import('../../../apps/frontend/src/app/features/wellness/wellness-check-in.component').then(m => m.WellnessCheckInComponent),
    canActivate: [authGuard],
    title: 'Wellness Check-in | Care Consulting Academy',
  }
];
