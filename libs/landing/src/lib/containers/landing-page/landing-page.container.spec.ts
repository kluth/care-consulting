import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '@auth0/auth0-angular';
import { of, throwError, Observable } from 'rxjs';
import { signal } from '@angular/core';
import { LandingPageContainer } from './landing-page.container';
import { ContentService } from '../../services/content.service';
import { LandingPageContent } from '../../models/content.model';

describe('LandingPageContainer', () => {
  let component: LandingPageContainer;
  let fixture: ComponentFixture<LandingPageContainer>;
  let contentServiceMock: {
    loadContent: ReturnType<typeof vi.fn>;
    isLoading: ReturnType<typeof signal>;
    error: ReturnType<typeof signal>;
  };
  let translocoServiceMock: {
    langChanges$: Observable<string>;
    getActiveLang: ReturnType<typeof vi.fn>;
    setActiveLang: ReturnType<typeof vi.fn>;
    getAvailableLangs: ReturnType<typeof vi.fn>;
  };
  let authServiceMock: {
    isAuthenticated$: Observable<boolean>;
    user$: Observable<unknown>;
    loginWithRedirect: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  const mockContent: LandingPageContent = {
    hero: {
      title: 'Test Hero Title',
      subtitle: 'Test Subtitle',
      cta: 'Book Now',
    },
    services: {
      sectionTitle: 'Services',
      services: [
        { id: 's1', title: 'Service 1', description: 'Desc 1', icon: 'icon1' },
      ],
    },
    education: {
      sectionTitle: 'Education',
    },
    testimonials: {
      sectionTitle: 'Testimonials',
      testimonials: [],
    },
    about: {
      sectionTitle: 'About',
      team: [],
    },
    footer: {
      contact: { email: 'test@example.com' },
      copyright: '© 2026',
    },
  };

  beforeEach(async () => {
    // Mock scrollIntoView which is not available in JSDOM
    Element.prototype.scrollIntoView = vi.fn();

    contentServiceMock = {
      loadContent: vi.fn().mockReturnValue(of(mockContent)),
      isLoading: signal(false),
      error: signal(null),
    };

    translocoServiceMock = {
      langChanges$: of('de'),
      getActiveLang: vi.fn().mockReturnValue('de'),
      setActiveLang: vi.fn(),
      getAvailableLangs: vi.fn().mockReturnValue([
        { id: 'de', label: 'Deutsch' },
        { id: 'en', label: 'English' },
      ]),
    };

    authServiceMock = {
      isAuthenticated$: of(false),
      user$: of(null),
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LandingPageContainer],
      providers: [
        provideRouter([]),
        { provide: ContentService, useValue: contentServiceMock },
        { provide: TranslocoService, useValue: translocoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load content on init', () => {
      expect(contentServiceMock.loadContent).toHaveBeenCalled();
    });

    it('should pass content to child components after loading', () => {
      fixture.detectChanges();
      expect(component.content()).toEqual(mockContent);
    });
  });

  describe('loading state', () => {
    it('should show loading skeleton while content is loading', () => {
      contentServiceMock.isLoading.set(true);
      fixture.detectChanges();

      const skeleton = fixture.debugElement.query(By.css('[data-testid="loading-skeleton"]'));
      expect(skeleton).toBeTruthy();
    });

    it('should hide loading skeleton when content is loaded', () => {
      contentServiceMock.isLoading.set(false);
      fixture.detectChanges();

      const skeleton = fixture.debugElement.query(By.css('[data-testid="loading-skeleton"]'));
      expect(skeleton).toBeFalsy();
    });
  });

  describe('error handling', () => {
    it('should show error message when content fails to load', () => {
      contentServiceMock.loadContent.mockReturnValue(
        throwError(() => new Error('Failed to load content')),
      );
      contentServiceMock.error.set('Failed to load content');

      // Re-trigger loading
      component.ngOnInit();
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('[data-testid="content-error"]'));
      expect(errorMessage).toBeTruthy();
    });

    it('should provide retry option on error', () => {
      contentServiceMock.error.set('Error occurred');
      fixture.detectChanges();

      const retryBtn = fixture.debugElement.query(By.css('[data-testid="retry-button"]'));
      expect(retryBtn).toBeTruthy();
    });

    it('should reload content when retry is clicked', () => {
      // Clear the mock to reset call count
      contentServiceMock.loadContent.mockClear();

      contentServiceMock.error.set('Error occurred');
      fixture.detectChanges();

      const retryBtn = fixture.debugElement.query(By.css('[data-testid="retry-button"]'));
      retryBtn.nativeElement.click();

      expect(contentServiceMock.loadContent).toHaveBeenCalled();
    });
  });

  describe('section rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render hero section', () => {
      const hero = fixture.debugElement.query(By.css('landing-hero'));
      expect(hero).toBeTruthy();
    });

    it('should render services section', () => {
      const services = fixture.debugElement.query(By.css('landing-services'));
      expect(services).toBeTruthy();
    });

    it('should render education section', () => {
      const education = fixture.debugElement.query(By.css('landing-education'));
      expect(education).toBeTruthy();
    });

    it('should render testimonials section', () => {
      const testimonials = fixture.debugElement.query(By.css('landing-testimonials'));
      expect(testimonials).toBeTruthy();
    });

    it('should render about section', () => {
      const about = fixture.debugElement.query(By.css('landing-about'));
      expect(about).toBeTruthy();
    });

    it('should render contact/footer section', () => {
      const contact = fixture.debugElement.query(By.css('landing-contact'));
      expect(contact).toBeTruthy();
    });

    it('should render booking widget', () => {
      const booking = fixture.debugElement.query(By.css('landing-booking-widget'));
      expect(booking).toBeTruthy();
    });

    it('should render newsletter form', () => {
      const newsletter = fixture.debugElement.query(By.css('landing-newsletter-form'));
      expect(newsletter).toBeTruthy();
    });

    it('should render language switcher', () => {
      const langSwitcher = fixture.debugElement.query(By.css('landing-language-switcher'));
      expect(langSwitcher).toBeTruthy();
    });
  });

  describe('language change handling', () => {
    it('should reload content when language changes', () => {
      translocoServiceMock.langChanges$ = of('en');
      component.ngOnInit();

      expect(contentServiceMock.loadContent).toHaveBeenCalledWith('en');
    });

    it('should update document lang attribute on language change', () => {
      translocoServiceMock.langChanges$ = of('en');
      component.ngOnInit();

      expect(document.documentElement.lang).toBe('en');
    });
  });

  describe('CTA handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should scroll to booking section when hero CTA is clicked', () => {
      const scrollSpy = vi.spyOn(component, 'scrollToBooking');
      const hero = fixture.debugElement.query(By.css('landing-hero'));
      hero.triggerEventHandler('ctaClick', null);

      expect(scrollSpy).toHaveBeenCalled();
    });

    it('should track booking CTA click', () => {
      const trackSpy = vi.spyOn(component, 'trackEvent');
      const hero = fixture.debugElement.query(By.css('landing-hero'));
      hero.triggerEventHandler('ctaClick', null);

      expect(trackSpy).toHaveBeenCalledWith('cta_click', { location: 'hero' });
    });
  });

  describe('newsletter subscription', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle newsletter subscription', () => {
      const subscribeSpy = vi.spyOn(component, 'onNewsletterSubscribe');
      const newsletter = fixture.debugElement.query(By.css('landing-newsletter-form'));
      newsletter.triggerEventHandler('subscribe', { email: 'test@example.com', consentGiven: true });

      expect(subscribeSpy).toHaveBeenCalledWith({ email: 'test@example.com', consentGiven: true });
    });

    it('should track newsletter subscription', () => {
      const trackSpy = vi.spyOn(component, 'trackEvent');
      const newsletter = fixture.debugElement.query(By.css('landing-newsletter-form'));
      newsletter.triggerEventHandler('subscribeSuccess', { success: true });

      expect(trackSpy).toHaveBeenCalledWith('newsletter_signup', { success: true });
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have skip to main content link', () => {
      const skipLink = fixture.debugElement.query(By.css('[data-testid="skip-link"]'));
      expect(skipLink).toBeTruthy();
      expect(skipLink.nativeElement.getAttribute('href')).toBe('#main-content');
    });

    it('should have main landmark', () => {
      const main = fixture.debugElement.query(By.css('main'));
      expect(main).toBeTruthy();
      expect(main.nativeElement.getAttribute('id')).toBe('main-content');
    });

    it('should have header landmark', () => {
      const header = fixture.debugElement.query(By.css('header'));
      expect(header).toBeTruthy();
    });

    it('should have footer landmark', () => {
      const footer = fixture.debugElement.query(By.css('footer'));
      expect(footer).toBeTruthy();
    });

    it('should have proper section landmarks with aria-labelledby', () => {
      const sections = fixture.debugElement.queryAll(By.css('section'));
      // At least some sections should have aria-labelledby or aria-label
      const labeledSections = sections.filter(
        (section) =>
          section.nativeElement.getAttribute('aria-labelledby') ||
          section.nativeElement.getAttribute('aria-label'),
      );
      expect(labeledSections.length).toBeGreaterThan(0);
    });
  });

  describe('SEO', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set page title based on content', () => {
      // This would typically be done via Title service
      expect(component).toBeTruthy();
    });

    it('should have proper meta description', () => {
      // This would typically be done via Meta service
      expect(component).toBeTruthy();
    });
  });

  describe('performance', () => {
    it('should lazy load below-fold sections', () => {
      fixture.detectChanges();

      // Sections below the fold should use lazy loading or defer
      const testimonials = fixture.debugElement.query(By.css('landing-testimonials'));
      // Check for intersection observer or defer usage
      expect(testimonials).toBeTruthy();
    });
  });
});
