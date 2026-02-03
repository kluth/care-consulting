import { Route } from '@angular/router';

export const complianceTrackingRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import(
        './containers/education-tracking-page/education-tracking-page.container'
      ).then((m) => m.EducationTrackingPageContainer),
    title: 'My Continuing Education',
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./components/team-dashboard/team-dashboard.component').then(
        (m) => m.TeamDashboardComponent
      ),
    title: 'Team Continuing Education',
    // In real app, add PDL role guard
  },
  {
    path: 'verify/:shortId',
    loadComponent: () =>
      import(
        './containers/certificate-verification/certificate-verification.container'
      ).then((m) => m.CertificateVerificationContainer),
    title: 'Certificate Verification',
  },
];
