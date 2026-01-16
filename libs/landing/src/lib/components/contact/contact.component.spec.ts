import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContactComponent } from './contact.component';
import { ContactInfo, FooterContent } from '../../models/content.model';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  const mockContactInfo: ContactInfo = {
    email: 'info@care-consulting.de',
    phone: '+49 123 456789',
    address: {
      street: 'Musterstraße 123',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Deutschland',
    },
  };

  const mockFooterContent: FooterContent = {
    contact: mockContactInfo,
    copyright: '© 2026 Care Consulting. Alle Rechte vorbehalten.',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/company/care-consulting' },
      { platform: 'instagram', url: 'https://instagram.com/care_consulting' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
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

  describe('email display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockFooterContent);
      fixture.detectChanges();
    });

    it('should display email address', () => {
      const email = fixture.debugElement.query(By.css('[data-testid="contact-email"]'));
      expect(email).toBeTruthy();
      expect(email.nativeElement.textContent).toContain(mockContactInfo.email);
    });

    it('should have mailto link for email', () => {
      const emailLink = fixture.debugElement.query(By.css('[data-testid="contact-email"]'));
      expect(emailLink.nativeElement.getAttribute('href')).toBe(`mailto:${mockContactInfo.email}`);
    });
  });

  describe('phone display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockFooterContent);
      fixture.detectChanges();
    });

    it('should display phone number', () => {
      const phone = fixture.debugElement.query(By.css('[data-testid="contact-phone"]'));
      expect(phone).toBeTruthy();
      expect(phone.nativeElement.textContent).toContain(mockContactInfo.phone);
    });

    it('should have tel link for phone', () => {
      const phoneLink = fixture.debugElement.query(By.css('[data-testid="contact-phone"]'));
      // Phone numbers in tel: links should not have spaces
      const expectedHref = `tel:${mockContactInfo.phone?.replace(/\s/g, '')}`;
      expect(phoneLink.nativeElement.getAttribute('href')).toBe(expectedHref);
    });
  });

  describe('address display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockFooterContent);
      fixture.detectChanges();
    });

    it('should display address', () => {
      const address = fixture.debugElement.query(By.css('[data-testid="contact-address"]'));
      expect(address).toBeTruthy();
    });

    it('should display street', () => {
      const address = fixture.debugElement.query(By.css('[data-testid="contact-address"]'));
      expect(address.nativeElement.textContent).toContain(mockContactInfo.address?.street);
    });

    it('should display city with postal code', () => {
      const address = fixture.debugElement.query(By.css('[data-testid="contact-address"]'));
      expect(address.nativeElement.textContent).toContain(mockContactInfo.address?.postalCode);
      expect(address.nativeElement.textContent).toContain(mockContactInfo.address?.city);
    });

    it('should display country', () => {
      const address = fixture.debugElement.query(By.css('[data-testid="contact-address"]'));
      expect(address.nativeElement.textContent).toContain(mockContactInfo.address?.country);
    });
  });

  describe('social links', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockFooterContent);
      fixture.detectChanges();
    });

    it('should display all social links', () => {
      const socialLinks = fixture.debugElement.queryAll(By.css('[data-testid="social-link"]'));
      expect(socialLinks.length).toBe(mockFooterContent.socialLinks?.length);
    });

    it('should have correct href for social links', () => {
      const socialLinks = fixture.debugElement.queryAll(By.css('[data-testid="social-link"]'));
      mockFooterContent.socialLinks?.forEach((link, index) => {
        expect(socialLinks[index].nativeElement.getAttribute('href')).toBe(link.url);
      });
    });

    it('should open social links in new tab', () => {
      const socialLinks = fixture.debugElement.queryAll(By.css('[data-testid="social-link"]'));
      socialLinks.forEach((link) => {
        expect(link.nativeElement.getAttribute('target')).toBe('_blank');
        expect(link.nativeElement.getAttribute('rel')).toContain('noopener');
      });
    });
  });

  describe('copyright', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockFooterContent);
      fixture.detectChanges();
    });

    it('should display copyright text', () => {
      const copyright = fixture.debugElement.query(By.css('[data-testid="copyright"]'));
      expect(copyright).toBeTruthy();
      expect(copyright.nativeElement.textContent).toContain(mockFooterContent.copyright);
    });
  });

  describe('edge cases', () => {
    it('should handle contact without phone', () => {
      const contentNoPhone: FooterContent = {
        contact: {
          email: 'test@example.com',
        },
        copyright: '© 2026',
      };
      fixture.componentRef.setInput('content', contentNoPhone);
      fixture.detectChanges();

      const phone = fixture.debugElement.query(By.css('[data-testid="contact-phone"]'));
      expect(phone).toBeFalsy();
    });

    it('should handle contact without address', () => {
      const contentNoAddress: FooterContent = {
        contact: {
          email: 'test@example.com',
          phone: '+49 123 456789',
        },
        copyright: '© 2026',
      };
      fixture.componentRef.setInput('content', contentNoAddress);
      fixture.detectChanges();

      const address = fixture.debugElement.query(By.css('[data-testid="contact-address"]'));
      expect(address).toBeFalsy();
    });

    it('should handle missing social links', () => {
      const contentNoSocial: FooterContent = {
        contact: mockContactInfo,
        copyright: '© 2026',
      };
      fixture.componentRef.setInput('content', contentNoSocial);
      fixture.detectChanges();

      const socialLinks = fixture.debugElement.queryAll(By.css('[data-testid="social-link"]'));
      expect(socialLinks.length).toBe(0);
    });

    it('should handle empty social links array', () => {
      const contentEmptySocial: FooterContent = {
        contact: mockContactInfo,
        copyright: '© 2026',
        socialLinks: [],
      };
      fixture.componentRef.setInput('content', contentEmptySocial);
      fixture.detectChanges();

      const socialLinks = fixture.debugElement.queryAll(By.css('[data-testid="social-link"]'));
      expect(socialLinks.length).toBe(0);
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockFooterContent);
      fixture.detectChanges();
    });

    it('should use address element for contact address', () => {
      const addressElement = fixture.debugElement.query(By.css('address'));
      expect(addressElement).toBeTruthy();
    });

    it('should have accessible labels for social links', () => {
      const socialLinks = fixture.debugElement.queryAll(By.css('[data-testid="social-link"]'));
      socialLinks.forEach((link) => {
        expect(link.nativeElement.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should have proper semantic structure in footer', () => {
      // Footer element should be present
      const footer = fixture.debugElement.query(By.css('footer'));
      expect(footer).toBeTruthy();
    });
  });
});
