import { inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TranslocoLoader,
  provideTransloco,
  TranslocoModule,
} from '@jsverse/transloco';

export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export const translocoProviders = provideTransloco({
  config: {
    availableLangs: ['de', 'en'],
    defaultLang: 'de',
    fallbackLang: 'de',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
    missingHandler: {
      useFallbackTranslation: true,
    },
  },
  loader: TranslocoHttpLoader,
});
