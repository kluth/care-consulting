import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BookingWidgetComponent } from './booking-widget.component';

describe('BookingWidgetComponent', () => {
  let component: BookingWidgetComponent;
  let fixture: ComponentFixture<BookingWidgetComponent>;

  const mockCalComUrl = 'https://cal.com/care-consulting/consultation';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingWidgetComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have loading state initially true', () => {
      expect(component.isLoading()).toBe(true);
    });

    it('should have error state initially false', () => {
      expect(component.hasError()).toBe(false);
    });

    it('should accept calComUrl as input', () => {
      fixture.componentRef.setInput('calComUrl', mockCalComUrl);
      fixture.detectChanges();
      expect(component.calComUrl()).toBe(mockCalComUrl);
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('calComUrl', mockCalComUrl);
      fixture.detectChanges();
    });

    it('should show loading indicator while loading', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('[data-testid="booking-loader"]'));
      expect(loader).toBeTruthy();
    });

    it('should hide loading indicator when loaded', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('[data-testid="booking-loader"]'));
      expect(loader).toBeFalsy();
    });

    it('should set loading to false after widget loads', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      // Simulate widget load
      component.onWidgetLoad();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('calComUrl', mockCalComUrl);
      fixture.detectChanges();
    });

    it('should show error message when widget fails to load', () => {
      component.hasError.set(true);
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testid="booking-error"]'));
      expect(error).toBeTruthy();
    });

    it('should hide widget container when error occurs', () => {
      component.hasError.set(true);
      fixture.detectChanges();

      const widgetContainer = fixture.debugElement.query(
        By.css('[data-testid="booking-widget-container"]'),
      );
      expect(widgetContainer).toBeFalsy();
    });

    it('should show fallback contact option when error occurs', () => {
      component.hasError.set(true);
      fixture.detectChanges();

      const fallback = fixture.debugElement.query(By.css('[data-testid="booking-fallback"]'));
      expect(fallback).toBeTruthy();
    });

    it('should have mailto link in fallback', () => {
      component.hasError.set(true);
      fixture.componentRef.setInput('fallbackEmail', 'contact@care-consulting.de');
      fixture.detectChanges();

      const mailtoLink = fixture.debugElement.query(By.css('[data-testid="booking-fallback-email"]'));
      expect(mailtoLink).toBeTruthy();
      expect(mailtoLink.nativeElement.getAttribute('href')).toContain('mailto:');
    });

    it('should emit errorOccurred event when widget fails', () => {
      const errorSpy = vi.fn();
      component.errorOccurred.subscribe(errorSpy);

      component.onWidgetError(new Error('Widget failed to load'));

      expect(errorSpy).toHaveBeenCalled();
      expect(component.hasError()).toBe(true);
    });
  });

  describe('Cal.com integration', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('calComUrl', mockCalComUrl);
      fixture.detectChanges();
    });

    it('should render Cal.com embed container', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const widgetContainer = fixture.debugElement.query(
        By.css('[data-testid="booking-widget-container"]'),
      );
      expect(widgetContainer).toBeTruthy();
    });

    it('should pass calComUrl to embed', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      // The actual Cal.com embed would use this URL
      expect(component.calComUrl()).toBe(mockCalComUrl);
    });

    it('should emit bookingCompleted when booking is successful', () => {
      const completedSpy = vi.fn();
      component.bookingCompleted.subscribe(completedSpy);

      component.onBookingComplete({ eventId: 'test-123' });

      expect(completedSpy).toHaveBeenCalledWith({ eventId: 'test-123' });
    });
  });

  describe('retry functionality', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('calComUrl', mockCalComUrl);
      component.hasError.set(true);
      fixture.detectChanges();
    });

    it('should show retry button when error occurs', () => {
      const retryBtn = fixture.debugElement.query(By.css('[data-testid="booking-retry"]'));
      expect(retryBtn).toBeTruthy();
    });

    it('should reset error state and reload widget on retry', () => {
      const retryBtn = fixture.debugElement.query(By.css('[data-testid="booking-retry"]'));
      retryBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.hasError()).toBe(false);
      expect(component.isLoading()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined calComUrl gracefully', () => {
      fixture.componentRef.setInput('calComUrl', undefined);
      fixture.detectChanges();

      expect(component.hasError()).toBe(true);
    });

    it('should handle empty calComUrl', () => {
      fixture.componentRef.setInput('calComUrl', '');
      fixture.detectChanges();

      expect(component.hasError()).toBe(true);
    });

    it('should timeout and show error if widget takes too long', async () => {
      fixture.componentRef.setInput('calComUrl', mockCalComUrl);
      fixture.componentRef.setInput('loadTimeout', 50); // Short timeout for test
      fixture.detectChanges();

      // Manually trigger loading (since isPlatformBrowser returns false in test)
      component.retry();
      fixture.detectChanges();

      // Verify loading state
      expect(component.isLoading()).toBe(true);

      // Wait for timeout using real timers
      await new Promise((resolve) => setTimeout(resolve, 100));
      fixture.detectChanges();

      expect(component.hasError()).toBe(true);
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('calComUrl', mockCalComUrl);
      fixture.detectChanges();
    });

    it('should have accessible loading indicator', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('[data-testid="booking-loader"]'));
      expect(loader.nativeElement.getAttribute('aria-label')).toBeTruthy();
      expect(loader.nativeElement.getAttribute('role')).toBe('status');
    });

    it('should have accessible error message', () => {
      component.hasError.set(true);
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testid="booking-error"]'));
      expect(error.nativeElement.getAttribute('role')).toBe('alert');
    });

    it('should focus on widget container when loaded', () => {
      component.onWidgetLoad();
      fixture.detectChanges();

      // Widget container should be focusable or focus management handled
      const widgetContainer = fixture.debugElement.query(
        By.css('[data-testid="booking-widget-container"]'),
      );
      expect(widgetContainer).toBeTruthy();
    });
  });
});
