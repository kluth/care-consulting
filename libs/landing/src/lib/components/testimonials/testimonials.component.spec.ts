import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestimonialsComponent } from './testimonials.component';
import { TestimonialsContent, Testimonial } from '../../models/content.model';

describe('TestimonialsComponent', () => {
  let component: TestimonialsComponent;
  let fixture: ComponentFixture<TestimonialsComponent>;

  const mockTestimonials: Testimonial[] = [
    {
      id: 'testimonial-1',
      quote:
        'Die Beratung hat unsere MDK-Bewertung von 3.5 auf 1.8 verbessert. Absolut empfehlenswert!',
      author: 'Maria Schmidt',
      role: 'Pflegedienstleitung',
      company: 'Seniorenheim Sonnenschein',
      avatar: '/assets/avatars/maria.jpg',
    },
    {
      id: 'testimonial-2',
      quote: 'Praxisnahe Schulungen, die unser Team wirklich weitergebracht haben.',
      author: 'Thomas Müller',
      role: 'Einrichtungsleiter',
      company: 'Pflegeheim am Park',
    },
    {
      id: 'testimonial-3',
      quote: 'Sehr kompetente und einfühlsame Beratung. Die Prozessoptimierung war ein voller Erfolg.',
      author: 'Sandra Weber',
      role: 'Qualitätsbeauftragte',
    },
  ];

  const mockTestimonialsContent: TestimonialsContent = {
    sectionTitle: 'Das sagen unsere Kunden',
    testimonials: mockTestimonials,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialsComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have undefined content by default', () => {
      expect(component.content()).toBeUndefined();
    });

    it('should start with first testimonial active', () => {
      fixture.componentRef.setInput('content', mockTestimonialsContent);
      fixture.detectChanges();
      expect(component.activeIndex()).toBe(0);
    });
  });

  describe('content rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockTestimonialsContent);
      fixture.detectChanges();
    });

    it('should display section title', () => {
      const title = fixture.debugElement.query(By.css('[data-testid="testimonials-title"]'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain(mockTestimonialsContent.sectionTitle);
    });

    it('should display testimonial quote', () => {
      const quote = fixture.debugElement.query(By.css('[data-testid="testimonial-quote"]'));
      expect(quote).toBeTruthy();
      expect(quote.nativeElement.textContent).toContain(mockTestimonials[0].quote);
    });

    it('should display author name', () => {
      const author = fixture.debugElement.query(By.css('[data-testid="testimonial-author"]'));
      expect(author).toBeTruthy();
      expect(author.nativeElement.textContent).toContain(mockTestimonials[0].author);
    });

    it('should display author role', () => {
      const role = fixture.debugElement.query(By.css('[data-testid="testimonial-role"]'));
      expect(role).toBeTruthy();
      expect(role.nativeElement.textContent).toContain(mockTestimonials[0].role);
    });

    it('should display company when available', () => {
      const company = fixture.debugElement.query(By.css('[data-testid="testimonial-company"]'));
      expect(company).toBeTruthy();
      expect(company.nativeElement.textContent).toContain(mockTestimonials[0].company);
    });

    it('should display avatar when available', () => {
      const avatar = fixture.debugElement.query(By.css('[data-testid="testimonial-avatar"]'));
      expect(avatar).toBeTruthy();
      expect(avatar.nativeElement.getAttribute('src')).toBe(mockTestimonials[0].avatar);
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockTestimonialsContent);
      fixture.detectChanges();
    });

    it('should display navigation dots/indicators', () => {
      const indicators = fixture.debugElement.queryAll(
        By.css('[data-testid="testimonial-indicator"]'),
      );
      expect(indicators.length).toBe(mockTestimonials.length);
    });

    it('should highlight active indicator', () => {
      const indicators = fixture.debugElement.queryAll(
        By.css('[data-testid="testimonial-indicator"]'),
      );
      expect(indicators[0].nativeElement.classList).toContain('active');
    });

    it('should navigate to next testimonial when next button is clicked', () => {
      const nextBtn = fixture.debugElement.query(By.css('[data-testid="testimonial-next"]'));
      nextBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.activeIndex()).toBe(1);
      const quote = fixture.debugElement.query(By.css('[data-testid="testimonial-quote"]'));
      expect(quote.nativeElement.textContent).toContain(mockTestimonials[1].quote);
    });

    it('should navigate to previous testimonial when prev button is clicked', () => {
      // First navigate to second testimonial
      component.activeIndex.set(1);
      fixture.detectChanges();

      const prevBtn = fixture.debugElement.query(By.css('[data-testid="testimonial-prev"]'));
      prevBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.activeIndex()).toBe(0);
    });

    it('should wrap to first testimonial when at end and next is clicked', () => {
      component.activeIndex.set(mockTestimonials.length - 1);
      fixture.detectChanges();

      const nextBtn = fixture.debugElement.query(By.css('[data-testid="testimonial-next"]'));
      nextBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.activeIndex()).toBe(0);
    });

    it('should wrap to last testimonial when at beginning and prev is clicked', () => {
      component.activeIndex.set(0);
      fixture.detectChanges();

      const prevBtn = fixture.debugElement.query(By.css('[data-testid="testimonial-prev"]'));
      prevBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.activeIndex()).toBe(mockTestimonials.length - 1);
    });

    it('should navigate directly when indicator is clicked', () => {
      const indicators = fixture.debugElement.queryAll(
        By.css('[data-testid="testimonial-indicator"]'),
      );
      indicators[2].nativeElement.click();
      fixture.detectChanges();

      expect(component.activeIndex()).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle single testimonial', () => {
      const singleContent: TestimonialsContent = {
        sectionTitle: 'Testimonials',
        testimonials: [mockTestimonials[0]],
      };
      fixture.componentRef.setInput('content', singleContent);
      fixture.detectChanges();

      // Navigation should be hidden when there's only one testimonial
      const indicators = fixture.debugElement.queryAll(
        By.css('[data-testid="testimonial-indicator"]'),
      );
      expect(indicators.length).toBe(0);

      // The testimonial should still be displayed
      const quote = fixture.debugElement.query(By.css('[data-testid="testimonial-quote"]'));
      expect(quote).toBeTruthy();
    });

    it('should handle empty testimonials array', () => {
      const emptyContent: TestimonialsContent = {
        sectionTitle: 'Testimonials',
        testimonials: [],
      };
      fixture.componentRef.setInput('content', emptyContent);
      fixture.detectChanges();

      const quote = fixture.debugElement.query(By.css('[data-testid="testimonial-quote"]'));
      expect(quote).toBeFalsy();
    });

    it('should handle testimonial without company', () => {
      component.activeIndex.set(2); // Third testimonial has no company
      fixture.componentRef.setInput('content', mockTestimonialsContent);
      fixture.detectChanges();

      const company = fixture.debugElement.query(By.css('[data-testid="testimonial-company"]'));
      expect(company).toBeFalsy();
    });

    it('should handle testimonial without avatar', () => {
      component.activeIndex.set(1); // Second testimonial has no avatar
      fixture.componentRef.setInput('content', mockTestimonialsContent);
      fixture.detectChanges();

      const avatar = fixture.debugElement.query(By.css('[data-testid="testimonial-avatar"]'));
      // Should show placeholder or no avatar
    });

    it('should handle very long testimonial text', () => {
      const longTestimonial: Testimonial = {
        id: 'long',
        quote: 'A'.repeat(500), // Very long quote
        author: 'Test Author',
        role: 'Role',
      };
      const longContent: TestimonialsContent = {
        sectionTitle: 'Testimonials',
        testimonials: [longTestimonial],
      };
      fixture.componentRef.setInput('content', longContent);
      fixture.detectChanges();

      // Component should handle long text gracefully (truncation or scroll)
      expect(component).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockTestimonialsContent);
      fixture.detectChanges();
    });

    it('should have section title as h2', () => {
      const title = fixture.debugElement.query(By.css('[data-testid="testimonials-title"]'));
      expect(title.nativeElement.tagName.toLowerCase()).toBe('h2');
    });

    it('should use blockquote for testimonial quote', () => {
      const quote = fixture.debugElement.query(By.css('[data-testid="testimonial-quote"]'));
      expect(quote.nativeElement.tagName.toLowerCase()).toBe('blockquote');
    });

    it('should have accessible navigation buttons', () => {
      const prevBtn = fixture.debugElement.query(By.css('[data-testid="testimonial-prev"]'));
      const nextBtn = fixture.debugElement.query(By.css('[data-testid="testimonial-next"]'));

      expect(prevBtn.nativeElement.getAttribute('aria-label')).toBeTruthy();
      expect(nextBtn.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('should indicate current testimonial for screen readers', () => {
      const container = fixture.debugElement.query(
        By.css('[data-testid="testimonials-container"]'),
      );
      // Should have aria-live or similar for announcements
      expect(container).toBeTruthy();
    });

    it('should have alt text on avatar images', () => {
      const avatar = fixture.debugElement.query(By.css('[data-testid="testimonial-avatar"]'));
      if (avatar) {
        expect(avatar.nativeElement.getAttribute('alt')).toBeTruthy();
      }
    });
  });
});
