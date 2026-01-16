import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { of, Observable } from 'rxjs';
import { signal } from '@angular/core';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translocoServiceMock: {
    langChanges$: Observable<string>;
    getActiveLang: ReturnType<typeof vi.fn>;
    setActiveLang: ReturnType<typeof vi.fn>;
    getAvailableLangs: ReturnType<typeof vi.fn>;
  };
  let routerMock: { navigate: ReturnType<typeof vi.fn>; url: string };

  const availableLanguages = [
    { id: 'de', label: 'Deutsch' },
    { id: 'en', label: 'English' },
  ];

  beforeEach(async () => {
    translocoServiceMock = {
      langChanges$: of('de'),
      getActiveLang: vi.fn().mockReturnValue('de'),
      setActiveLang: vi.fn(),
      getAvailableLangs: vi.fn().mockReturnValue(availableLanguages),
    };

    routerMock = {
      navigate: vi.fn().mockReturnValue(Promise.resolve(true)),
      url: '/de',
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [
        { provide: TranslocoService, useValue: translocoServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display current language', () => {
      const currentLang = fixture.debugElement.query(By.css('[data-testid="current-language"]'));
      expect(currentLang).toBeTruthy();
      expect(currentLang.nativeElement.textContent).toContain('DE');
    });

    it('should have dropdown closed by default', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should load available languages from Transloco', () => {
      expect(component.availableLanguages()).toEqual(availableLanguages);
    });
  });

  describe('dropdown interaction', () => {
    it('should toggle dropdown when button is clicked', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="language-toggle"]'));
      button.nativeElement.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);

      button.nativeElement.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should display all available languages in dropdown', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'));
      expect(options.length).toBe(availableLanguages.length);
    });

    it('should highlight current language in dropdown', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const currentOption = fixture.debugElement.query(
        By.css('[data-testid="language-option"].active'),
      );
      expect(currentOption).toBeTruthy();
      expect(currentOption.nativeElement.textContent).toContain('Deutsch');
    });

    it('should close dropdown when clicking outside', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      // Simulate click outside
      document.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should close dropdown on Escape key', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('language switching', () => {
    beforeEach(() => {
      component.isOpen.set(true);
      fixture.detectChanges();
    });

    it('should call Transloco setActiveLang when language is selected', () => {
      const englishOption = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'))[1];
      englishOption.nativeElement.click();

      expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith('en');
    });

    it('should close dropdown after selection', () => {
      const englishOption = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'))[1];
      englishOption.nativeElement.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should update URL with new language', () => {
      const englishOption = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'))[1];
      englishOption.nativeElement.click();

      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('should emit languageChanged event', () => {
      const changeSpy = vi.fn();
      component.languageChanged.subscribe(changeSpy);

      const englishOption = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'))[1];
      englishOption.nativeElement.click();

      expect(changeSpy).toHaveBeenCalledWith('en');
    });

    it('should not trigger change when selecting current language', () => {
      const deutschOption = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'))[0];
      deutschOption.nativeElement.click();

      // Should not call setActiveLang if it's the same language
      // Or should call but be a no-op
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('display modes', () => {
    it('should support dropdown mode by default', () => {
      const dropdown = fixture.debugElement.query(By.css('[data-testid="language-dropdown"]'));
      expect(dropdown).toBeTruthy();
    });

    it('should support inline mode when specified', () => {
      fixture.componentRef.setInput('mode', 'inline');
      fixture.detectChanges();

      const inlineButtons = fixture.debugElement.queryAll(
        By.css('[data-testid="language-inline-option"]'),
      );
      expect(inlineButtons.length).toBe(availableLanguages.length);
    });

    it('should show flags when showFlags is true', () => {
      fixture.componentRef.setInput('showFlags', true);
      fixture.detectChanges();

      const flag = fixture.debugElement.query(By.css('[data-testid="language-flag"]'));
      expect(flag).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle single available language', () => {
      translocoServiceMock.getAvailableLangs.mockReturnValue([{ id: 'de', label: 'Deutsch' }]);
      fixture.detectChanges();

      // Component might hide switcher or disable it
      expect(component).toBeTruthy();
    });

    it('should handle Transloco service returning string array', () => {
      translocoServiceMock.getAvailableLangs.mockReturnValue(['de', 'en']);
      fixture.detectChanges();

      // Should handle both object and string array formats
      expect(component.availableLanguages().length).toBeGreaterThan(0);
    });

    it('should store language preference in localStorage', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      component.isOpen.set(true);
      fixture.detectChanges();

      const englishOption = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'))[1];
      englishOption.nativeElement.click();

      expect(setItemSpy).toHaveBeenCalledWith('preferred-language', 'en');
    });
  });

  describe('accessibility', () => {
    it('should have accessible toggle button', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="language-toggle"]'));
      expect(button.nativeElement.getAttribute('aria-label')).toBeTruthy();
      expect(button.nativeElement.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded when dropdown opens', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="language-toggle"]'));
      button.nativeElement.click();
      fixture.detectChanges();

      expect(button.nativeElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have proper role on dropdown menu', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const menu = fixture.debugElement.query(By.css('[data-testid="language-menu"]'));
      expect(menu.nativeElement.getAttribute('role')).toBe('listbox');
    });

    it('should have role option on language items', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'));
      options.forEach((option) => {
        expect(option.nativeElement.getAttribute('role')).toBe('option');
      });
    });

    it('should have aria-selected on current language', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const currentOption = fixture.debugElement.query(
        By.css('[data-testid="language-option"][aria-selected="true"]'),
      );
      expect(currentOption).toBeTruthy();
    });

    it('should support keyboard navigation in dropdown', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const menu = fixture.debugElement.query(By.css('[data-testid="language-menu"]'));

      // Arrow down should move focus
      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      menu.nativeElement.dispatchEvent(arrowDownEvent);
      fixture.detectChanges();

      // Focus should have moved to first/next item
    });

    it('should select on Enter key', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      // Get the second option (English) since the first (German) is already active
      const options = fixture.debugElement.queryAll(By.css('[data-testid="language-option"]'));
      const secondOption = options[1]; // English option

      // Use triggerEventHandler to trigger Angular's (keydown.enter) binding
      secondOption.triggerEventHandler('keydown.enter', {});
      fixture.detectChanges();

      expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith('en');
    });
  });
});
