import * as Sentry from '@sentry/angular';
import { isDevMode } from '@angular/core';

export function initSentry() {
  const isDev = isDevMode();
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: isDev ? 'development' : 'production',
    enabled: !isDev,
    tracesSampleRate: 1.0,
  });
}
