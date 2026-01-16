import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { appRoutes } from './app.routes';
import { translocoProviders } from './transloco.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideAuth0({
      domain: 'care-consulting.eu.auth0.com',
      clientId: 'YOUR_CLIENT_ID',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://api.care-consulting.de',
      },
    }),
    translocoProviders,
  ],
};
