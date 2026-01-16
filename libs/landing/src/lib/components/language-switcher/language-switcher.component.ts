import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

interface Language {
  id: string;
  label: string;
}

@Component({
  selector: 'landing-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div data-testid="language-dropdown" class="lang-switcher">
      @if (mode() === 'dropdown') {
        <button
          data-testid="language-toggle"
          class="lang-switcher__toggle"
          type="button"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-label]="isOpen() ? 'Sprachmenü schließen' : 'Sprachmenü öffnen'"
          (click)="toggle($event)"
        >
          @if (showFlags()) {
            <span data-testid="language-flag" class="lang-switcher__flag" [attr.data-lang]="currentLang()"></span>
          }
          <span data-testid="current-language">{{ currentLang().toUpperCase() }}</span>
          <span class="lang-switcher__arrow" [class.open]="isOpen()">▼</span>
        </button>

        @if (isOpen()) {
          <ul
            data-testid="language-menu"
            class="lang-switcher__menu"
            role="listbox"
            (keydown)="onKeyDown($event)"
          >
            @for (lang of availableLanguages(); track lang.id) {
              <li
                data-testid="language-option"
                class="lang-switcher__option"
                [class.active]="lang.id === currentLang()"
                role="option"
                [attr.aria-selected]="lang.id === currentLang()"
                tabindex="0"
                (click)="selectLanguage(lang.id)"
                (keydown.enter)="selectLanguage(lang.id)"
              >
                @if (showFlags()) {
                  <span class="lang-switcher__flag" [attr.data-lang]="lang.id"></span>
                }
                {{ lang.label }}
              </li>
            }
          </ul>
        }
      } @else {
        <div class="lang-switcher__inline">
          @for (lang of availableLanguages(); track lang.id) {
            <button
              data-testid="language-inline-option"
              class="lang-switcher__inline-btn"
              [class.active]="lang.id === currentLang()"
              type="button"
              (click)="selectLanguage(lang.id)"
            >
              @if (showFlags()) {
                <span data-testid="language-flag" class="lang-switcher__flag" [attr.data-lang]="lang.id"></span>
              }
              {{ lang.id.toUpperCase() }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .lang-switcher {
      position: relative;
    }

    .lang-switcher__toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: transparent;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: border-color 0.2s;
    }

    .lang-switcher__toggle:hover {
      border-color: var(--color-primary, #1a365d);
    }

    .lang-switcher__toggle:focus-visible {
      outline: 2px solid var(--color-primary, #1a365d);
      outline-offset: 2px;
    }

    .lang-switcher__arrow {
      font-size: 0.625rem;
      transition: transform 0.2s;
    }

    .lang-switcher__arrow.open {
      transform: rotate(180deg);
    }

    .lang-switcher__menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      min-width: 150px;
      background: white;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      list-style: none;
      padding: 0.5rem 0;
      margin: 0;
      z-index: 100;
    }

    .lang-switcher__option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .lang-switcher__option:hover {
      background-color: var(--color-background, #f7fafc);
    }

    .lang-switcher__option:focus-visible {
      outline: 2px solid var(--color-primary, #1a365d);
      outline-offset: -2px;
    }

    .lang-switcher__option.active {
      background-color: var(--color-primary-light, #ebf8ff);
      color: var(--color-primary, #1a365d);
      font-weight: 600;
    }

    .lang-switcher__flag {
      width: 20px;
      height: 14px;
      background-color: var(--color-border, #e2e8f0);
      border-radius: 2px;
    }

    .lang-switcher__inline {
      display: flex;
      gap: 0.25rem;
    }

    .lang-switcher__inline-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .lang-switcher__inline-btn:hover {
      opacity: 1;
    }

    .lang-switcher__inline-btn.active {
      opacity: 1;
      font-weight: 700;
    }
  `],
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  private translocoService = inject(TranslocoService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  mode = input<'dropdown' | 'inline'>('dropdown');
  showFlags = input<boolean>(false);

  languageChanged = output<string>();

  isOpen = signal(false);
  currentLang = signal<string>('de');
  availableLanguages = signal<Language[]>([]);

  private langSubscription?: Subscription;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }
    const target = event.target as HTMLElement;
    const clickedInside =
      this.elementRef.nativeElement.contains(target) ||
      (event.composedPath && event.composedPath().includes(this.elementRef.nativeElement));

    if (!clickedInside) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.isOpen.set(false);
  }

  ngOnInit(): void {
    this.currentLang.set(this.translocoService.getActiveLang());

    const langs = this.translocoService.getAvailableLangs();
    this.availableLanguages.set(this.normalizeLanguages(langs));

    this.langSubscription = this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLang.set(lang);
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  toggle(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen.update((open) => !open);
  }

  selectLanguage(langId: string): void {
    if (langId === this.currentLang()) {
      this.isOpen.set(false);
      return;
    }

    this.translocoService.setActiveLang(langId);
    localStorage.setItem('preferred-language', langId);

    // Update URL with new language
    const currentUrl = this.router.url;
    const urlParts = currentUrl.split('/').filter(Boolean);

    // Replace language segment or add it
    if (urlParts[0] === this.currentLang()) {
      urlParts[0] = langId;
    } else {
      urlParts.unshift(langId);
    }

    this.router.navigate(['/' + urlParts.join('/')]);

    this.languageChanged.emit(langId);
    this.isOpen.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    const options = this.availableLanguages();
    const currentIndex = options.findIndex((l) => l.id === this.currentLang());

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % options.length;
        this.currentLang.set(options[nextIndex].id);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
        this.currentLang.set(options[prevIndex].id);
        break;
    }
  }

  private normalizeLanguages(langs: string[] | { id: string; label: string }[]): Language[] {
    if (langs.length === 0) return [];

    if (typeof langs[0] === 'string') {
      return (langs as string[]).map((id) => ({
        id,
        label: this.getLabelForLang(id),
      }));
    }

    return langs as Language[];
  }

  private getLabelForLang(id: string): string {
    const labels: Record<string, string> = {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      es: 'Español',
    };
    return labels[id] || id.toUpperCase();
  }
}
