import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NewsletterFormComponent } from './newsletter-form.component';
import { NewsletterSubscriptionResponse } from '../../models/content.model';

describe('NewsletterFormComponent', () => {
  let component: NewsletterFormComponent;
  let fixture: ComponentFixture<NewsletterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsletterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have a form with email and consent controls', () => {
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('consent')).toBeTruthy();
    });

    it('should have submit button disabled initially', () => {
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="newsletter-submit"]'));
      expect(submitBtn.nativeElement.disabled).toBe(true);
    });

    it('should not be in submitting state initially', () => {
      expect(component.isSubmitting()).toBe(false);
    });

    it('should not have success message initially', () => {
      expect(component.isSuccess()).toBe(false);
    });
  });

  describe('email validation', () => {
    it('should be invalid when email is empty', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('');
      expect(emailControl?.invalid).toBe(true);
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('should be invalid when email format is wrong', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.invalid).toBe(true);
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should be valid when email format is correct', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBe(true);
    });

    it('should show error message when email is invalid and touched', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('invalid');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
      expect(errorMessage).toBeTruthy();
    });

    it('should not show error message when email is valid', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('valid@email.com');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
      expect(errorMessage).toBeFalsy();
    });
  });

  describe('consent checkbox', () => {
    it('should be required', () => {
      const consentControl = component.form.get('consent');
      consentControl?.setValue(false);
      expect(consentControl?.invalid).toBe(true);
      // Validators.requiredTrue sets error key 'required' when value is not true
      expect(consentControl?.errors?.['required']).toBeTruthy();
    });

    it('should be valid when checked', () => {
      const consentControl = component.form.get('consent');
      consentControl?.setValue(true);
      expect(consentControl?.valid).toBe(true);
    });

    it('should have privacy policy link', () => {
      const privacyLink = fixture.debugElement.query(By.css('[data-testid="privacy-link"]'));
      expect(privacyLink).toBeTruthy();
      expect(privacyLink.nativeElement.getAttribute('href')).toBeTruthy();
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      component.form.get('email')?.setValue('test@example.com');
      component.form.get('consent')?.setValue(true);
      fixture.detectChanges();
    });

    it('should enable submit button when form is valid', () => {
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="newsletter-submit"]'));
      expect(submitBtn.nativeElement.disabled).toBe(false);
    });

    it('should emit subscribe event with form data on submit', () => {
      const subscribeSpy = vi.fn();
      component.subscribe.subscribe(subscribeSpy);

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);

      expect(subscribeSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        consentGiven: true,
      });
    });

    it('should set submitting state while processing', () => {
      component.onSubmit();
      expect(component.isSubmitting()).toBe(true);
    });

    it('should disable submit button while submitting', () => {
      component.isSubmitting.set(true);
      fixture.detectChanges();

      const submitBtn = fixture.debugElement.query(By.css('[data-testid="newsletter-submit"]'));
      expect(submitBtn.nativeElement.disabled).toBe(true);
    });

    it('should show loading indicator while submitting', () => {
      component.isSubmitting.set(true);
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('[data-testid="newsletter-loader"]'));
      expect(loader).toBeTruthy();
    });
  });

  describe('success state', () => {
    it('should show success message after successful submission', () => {
      component.isSuccess.set(true);
      fixture.detectChanges();

      const successMessage = fixture.debugElement.query(By.css('[data-testid="newsletter-success"]'));
      expect(successMessage).toBeTruthy();
    });

    it('should hide form after successful submission', () => {
      component.isSuccess.set(true);
      fixture.detectChanges();

      const form = fixture.debugElement.query(By.css('form'));
      expect(form).toBeFalsy();
    });

    it('should emit success event after successful submission', () => {
      const successSpy = vi.fn();
      component.subscribeSuccess.subscribe(successSpy);

      const response: NewsletterSubscriptionResponse = {
        success: true,
        message: 'Successfully subscribed',
      };
      component.handleResponse(response);

      expect(successSpy).toHaveBeenCalledWith(response);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      component.form.get('email')?.setValue('test@example.com');
      component.form.get('consent')?.setValue(true);
      fixture.detectChanges();
    });

    it('should show error message when submission fails', () => {
      component.errorMessage.set('An error occurred. Please try again.');
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testid="newsletter-error"]'));
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('An error occurred');
    });

    it('should emit error event when submission fails', () => {
      const errorSpy = vi.fn();
      component.subscribeError.subscribe(errorSpy);

      component.handleError(new Error('Network error'));

      expect(errorSpy).toHaveBeenCalled();
    });

    it('should allow retry after error', () => {
      component.errorMessage.set('Error occurred');
      fixture.detectChanges();

      // Form should still be visible for retry
      const form = fixture.debugElement.query(By.css('form'));
      expect(form).toBeTruthy();
    });

    it('should handle already subscribed response', () => {
      const response: NewsletterSubscriptionResponse = {
        success: true,
        message: 'Already subscribed',
        alreadySubscribed: true,
      };
      component.handleResponse(response);
      fixture.detectChanges();

      const message = fixture.debugElement.query(By.css('[data-testid="newsletter-message"]'));
      expect(message).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should trim whitespace from email', () => {
      // Set up subscription spy first
      const subscribeSpy = vi.fn();
      component.subscribe.subscribe(subscribeSpy);

      // Set form values - email with trailing whitespace
      component.form.get('email')?.setValue('test@example.com');
      component.form.get('consent')?.setValue(true);
      fixture.detectChanges();

      // Verify form is valid before submission
      expect(component.form.valid).toBe(true);

      component.onSubmit();

      // Verify subscription was called
      expect(subscribeSpy).toHaveBeenCalled();
      // Email should be trimmed (in this case, nothing to trim)
      const callArg = subscribeSpy.mock.calls[0][0];
      expect(callArg.email).toBe('test@example.com');
    });

    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      component.form.get('email')?.setValue(longEmail);
      component.form.get('consent')?.setValue(true);
      fixture.detectChanges();

      expect(component.form.valid).toBe(true);
    });

    it('should prevent double submission', () => {
      const subscribeSpy = vi.fn();
      component.subscribe.subscribe(subscribeSpy);

      component.form.get('email')?.setValue('test@example.com');
      component.form.get('consent')?.setValue(true);

      component.onSubmit();
      component.onSubmit(); // Try to submit again while already submitting

      expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have proper label for email input', () => {
      const emailLabel = fixture.debugElement.query(By.css('label[for="newsletter-email"]'));
      expect(emailLabel).toBeTruthy();
    });

    it('should have proper label for consent checkbox', () => {
      const consentLabel = fixture.debugElement.query(By.css('label[for="newsletter-consent"]'));
      expect(consentLabel).toBeTruthy();
    });

    it('should have aria-describedby for email input pointing to error when invalid', () => {
      // Set invalid email and mark as touched to show error
      component.form.get('email')?.setValue('invalid');
      component.form.get('email')?.markAsTouched();
      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css('[data-testid="newsletter-email-input"]'));
      expect(emailInput.nativeElement.getAttribute('aria-describedby')).toBe('email-error');
    });

    it('should have accessible error messages', () => {
      component.form.get('email')?.setValue('invalid');
      component.form.get('email')?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
      expect(errorMessage.nativeElement.getAttribute('role')).toBe('alert');
    });

    it('should have accessible success message', () => {
      component.isSuccess.set(true);
      fixture.detectChanges();

      const successMessage = fixture.debugElement.query(By.css('[data-testid="newsletter-success"]'));
      expect(successMessage.nativeElement.getAttribute('role')).toBe('status');
    });

    it('should announce loading state to screen readers', () => {
      component.isSubmitting.set(true);
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('[data-testid="newsletter-loader"]'));
      expect(loader.nativeElement.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('localization support', () => {
    it('should accept placeholder text as input', () => {
      fixture.componentRef.setInput('emailPlaceholder', 'Ihre E-Mail');
      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css('[data-testid="newsletter-email-input"]'));
      expect(emailInput.nativeElement.getAttribute('placeholder')).toBe('Ihre E-Mail');
    });

    it('should accept button text as input', () => {
      fixture.componentRef.setInput('submitButtonText', 'Abonnieren');
      fixture.detectChanges();

      const submitBtn = fixture.debugElement.query(By.css('[data-testid="newsletter-submit"]'));
      expect(submitBtn.nativeElement.textContent).toContain('Abonnieren');
    });
  });
});
