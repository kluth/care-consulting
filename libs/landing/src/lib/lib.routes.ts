import { Route } from '@angular/router';
import { LandingPageContainer } from './containers/landing-page/landing-page.container';
import { ImpressumPage } from './pages/impressum/impressum.page';
import { DatenschutzPage } from './pages/datenschutz/datenschutz.page';
import { AgbPage } from './pages/agb/agb.page';

export const landingRoutes: Route[] = [
  {
    path: '',
    component: LandingPageContainer,
  },
  {
    path: 'impressum',
    component: ImpressumPage,
    title: 'Impressum | Care Consulting',
  },
  {
    path: 'datenschutz',
    component: DatenschutzPage,
    title: 'Datenschutzerklärung | Care Consulting',
  },
  {
    path: 'agb',
    component: AgbPage,
    title: 'AGB | Care Consulting',
  },
];
