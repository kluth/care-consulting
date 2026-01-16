import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, tap, map, finalize } from 'rxjs';
import { LandingPageContent } from '../models/content.model';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private http = inject(HttpClient);

  private cache = new Map<string, LandingPageContent>();
  private currentContent: LandingPageContent | null = null;

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  loadContent(lang = 'de'): Observable<LandingPageContent> {
    // Check cache first
    const cached = this.cache.get(lang);
    if (cached) {
      this.currentContent = cached;
      return of(cached);
    }

    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<LandingPageContent>(`/assets/content/${lang}/landing.json`).pipe(
      tap((content) => {
        if (this.validateContent(content)) {
          this.cache.set(lang, content);
          this.currentContent = content;
        } else {
          throw new Error('Invalid content structure');
        }
      }),
      catchError((err) => {
        // If not default language, try fallback
        if (lang !== 'de') {
          return this.loadContent('de');
        }
        this.error.set(err.message || 'Failed to load content');
        throw err;
      }),
      finalize(() => {
        this.isLoading.set(false);
      }),
    );
  }

  getContentSection<K extends keyof LandingPageContent>(section: K): LandingPageContent[K] | undefined {
    return this.currentContent?.[section];
  }

  clearCache(): void {
    this.cache.clear();
    this.currentContent = null;
  }

  private validateContent(content: unknown): content is LandingPageContent {
    if (!content || typeof content !== 'object') {
      return false;
    }

    const c = content as Record<string, unknown>;

    // Check required top-level sections
    const requiredSections = ['hero', 'services', 'education', 'testimonials', 'about', 'footer'];
    for (const section of requiredSections) {
      if (!c[section]) {
        this.error.set(`Missing required section: ${section}`);
        return false;
      }
    }

    // Check hero has required fields
    const hero = c['hero'] as Record<string, unknown>;
    if (!hero['title'] || !hero['subtitle'] || !hero['cta']) {
      this.error.set('Hero section missing required fields');
      return false;
    }

    return true;
  }
}
