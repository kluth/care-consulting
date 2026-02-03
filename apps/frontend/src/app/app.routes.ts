import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  // Landing page routes
  {
    path: '',
    loadChildren: () => import('@care-consulting/landing').then((m) => m.landingRoutes),
  },
  {
    path: ':lang',
    loadChildren: () => import('@care-consulting/landing').then((m) => m.landingRoutes),
  },
  // Education platform / Academy
  {
    path: 'academy',
    loadChildren: () => import('@care-consulting/education').then((m) => m.educationRoutes),
  },
  {
    path: 'wellness',
    loadComponent: () => import('./features/wellness/wellness-dashboard.component').then(m => m.WellnessDashboardComponent)
  },
  // Catch-all redirect
  {
    path: '**',
    redirectTo: '',
  },
];
