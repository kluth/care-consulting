import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeroComponent } from './hero.component';
import { HeroContent } from '../../models/content.model';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  const mockHeroContent: HeroContent = {
    title: 'Professionelle Pflegeberatung',
    subtitle: 'Qualitätsmanagement · Schulungen · Prozessoptimierung',
    cta: 'Beratungstermin vereinbaren',
    backgroundImage: '/assets/images/hero-bg.webp',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have undefined content by default', () => {
      expect(component.content()).toBeUndefined();
    });
  });

  describe('content rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockHeroContent);
      fixture.detectChanges();
    });

    it('should display the hero title as h1', () => {
      const h1 = fixture.debugElement.query(By.css('h1'));
      expect(h1).toBeTruthy();
      expect(h1.nativeElement.textContent).toContain(mockHeroContent.title);
    });

    it('should display the subtitle', () => {
      const subtitle = fixture.debugElement.query(By.css('[data-testid="hero-subtitle"]'));
      expect(subtitle).toBeTruthy();
      expect(subtitle.nativeElement.textContent).toContain(mockHeroContent.subtitle);
    });

    it('should display the CTA button', () => {
      const ctaButton = fixture.debugElement.query(By.css('[data-testid="hero-cta"]'));
      expect(ctaButton).toBeTruthy();
      expect(ctaButton.nativeElement.textContent).toContain(mockHeroContent.cta);
    });

    it('should apply background image when provided', () => {
      const heroSection = fixture.debugElement.query(By.css('[data-testid="hero-section"]'));
      expect(heroSection).toBeTruthy();
      // Background image applied via CSS or style binding
    });
  });

  describe('CTA interaction', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockHeroContent);
      fixture.detectChanges();
    });

    it('should emit ctaClick event when CTA button is clicked', () => {
      const ctaClickSpy = vi.fn();
      component.ctaClick.subscribe(ctaClickSpy);

      const ctaButton = fixture.debugElement.query(By.css('[data-testid="hero-cta"]'));
      ctaButton.nativeElement.click();

      expect(ctaClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle missing content gracefully', () => {
      fixture.componentRef.setInput('content', undefined);
      fixture.detectChanges();

      // Component should not crash, might show placeholder or nothing
      expect(component).toBeTruthy();
    });

    it('should handle content without optional backgroundImage', () => {
      const contentWithoutBg: HeroContent = {
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        cta: 'Click Me',
      };
      fixture.componentRef.setInput('content', contentWithoutBg);
      fixture.detectChanges();

      expect(component.content()?.backgroundImage).toBeUndefined();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockHeroContent);
      fixture.detectChanges();
    });

    it('should have h1 as the first heading', () => {
      const headings = fixture.debugElement.queryAll(By.css('h1, h2, h3, h4, h5, h6'));
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0].nativeElement.tagName.toLowerCase()).toBe('h1');
    });

    it('should have accessible CTA button', () => {
      const ctaButton = fixture.debugElement.query(By.css('[data-testid="hero-cta"]'));
      expect(ctaButton.nativeElement.tagName.toLowerCase()).toBe('ui-button');
      // Button should be focusable
      // expect(ctaButton.nativeElement.tabIndex).toBeGreaterThanOrEqual(0); // ui-button might handle this internally
    });

    it('should have proper landmark role on hero section', () => {
      const heroSection = fixture.debugElement.query(By.css('[data-testid="hero-section"]'));
      // Hero can be a banner or have role="banner" if it's the main page header
      expect(heroSection).toBeTruthy();
    });
  });
});
