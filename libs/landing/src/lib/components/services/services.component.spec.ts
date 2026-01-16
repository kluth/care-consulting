import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ServicesComponent } from './services.component';
import { ServicesContent, Service } from '../../models/content.model';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;

  const mockServices: Service[] = [
    {
      id: 'quality',
      title: 'Qualitätsmanagement',
      description: 'MDK-Audits, Qualitätssicherung und Dokumentation',
      icon: 'quality-icon',
      features: ['MDK Vorbereitung', 'QM-Systeme', 'Dokumentation'],
    },
    {
      id: 'training',
      title: 'Schulungen',
      description: 'Inhouse-Schulungen und Teamentwicklung',
      icon: 'training-icon',
      features: ['Leadership', 'Teambuilding', 'Fachfortbildungen'],
    },
    {
      id: 'operations',
      title: 'Prozessoptimierung',
      description: 'Digitalisierung und Effizienzsteigerung',
      icon: 'operations-icon',
    },
  ];

  const mockServicesContent: ServicesContent = {
    sectionTitle: 'Unsere Leistungen',
    sectionSubtitle: 'Maßgeschneiderte Lösungen für Ihre Einrichtung',
    services: mockServices,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesComponent);
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
      fixture.componentRef.setInput('content', mockServicesContent);
      fixture.detectChanges();
    });

    it('should display section title', () => {
      const title = fixture.debugElement.query(By.css('[data-testid="services-title"]'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain(mockServicesContent.sectionTitle);
    });

    it('should display section subtitle when provided', () => {
      const subtitle = fixture.debugElement.query(By.css('[data-testid="services-subtitle"]'));
      expect(subtitle).toBeTruthy();
      expect(subtitle.nativeElement.textContent).toContain(mockServicesContent.sectionSubtitle);
    });

    it('should render all service cards', () => {
      const serviceCards = fixture.debugElement.queryAll(By.css('[data-testid="service-card"]'));
      expect(serviceCards.length).toBe(mockServices.length);
    });

    it('should display each service title', () => {
      const serviceTitles = fixture.debugElement.queryAll(By.css('[data-testid="service-title"]'));
      expect(serviceTitles.length).toBe(mockServices.length);

      mockServices.forEach((service, index) => {
        expect(serviceTitles[index].nativeElement.textContent).toContain(service.title);
      });
    });

    it('should display each service description', () => {
      const serviceDescriptions = fixture.debugElement.queryAll(
        By.css('[data-testid="service-description"]'),
      );
      expect(serviceDescriptions.length).toBe(mockServices.length);

      mockServices.forEach((service, index) => {
        expect(serviceDescriptions[index].nativeElement.textContent).toContain(service.description);
      });
    });

    it('should display service features when available', () => {
      const qualityCard = fixture.debugElement.queryAll(By.css('[data-testid="service-card"]'))[0];
      const features = qualityCard.queryAll(By.css('[data-testid="service-feature"]'));
      expect(features.length).toBe(mockServices[0].features?.length);
    });
  });

  describe('service card interaction', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockServicesContent);
      fixture.detectChanges();
    });

    it('should emit serviceClick with service id when card is clicked', () => {
      const serviceClickSpy = vi.fn();
      component.serviceClick.subscribe(serviceClickSpy);

      const firstCard = fixture.debugElement.query(By.css('[data-testid="service-card"]'));
      firstCard.nativeElement.click();

      expect(serviceClickSpy).toHaveBeenCalledWith(mockServices[0].id);
    });
  });

  describe('edge cases', () => {
    it('should handle empty services array', () => {
      const emptyContent: ServicesContent = {
        sectionTitle: 'Services',
        services: [],
      };
      fixture.componentRef.setInput('content', emptyContent);
      fixture.detectChanges();

      const serviceCards = fixture.debugElement.queryAll(By.css('[data-testid="service-card"]'));
      expect(serviceCards.length).toBe(0);
    });

    it('should handle missing subtitle gracefully', () => {
      const contentWithoutSubtitle: ServicesContent = {
        sectionTitle: 'Services',
        services: mockServices,
      };
      fixture.componentRef.setInput('content', contentWithoutSubtitle);
      fixture.detectChanges();

      const subtitle = fixture.debugElement.query(By.css('[data-testid="services-subtitle"]'));
      expect(subtitle).toBeFalsy();
    });

    it('should handle service without features', () => {
      fixture.componentRef.setInput('content', mockServicesContent);
      fixture.detectChanges();

      // Third service (operations) has no features
      const operationsCard = fixture.debugElement.queryAll(By.css('[data-testid="service-card"]'))[2];
      const features = operationsCard.queryAll(By.css('[data-testid="service-feature"]'));
      expect(features.length).toBe(0);
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockServicesContent);
      fixture.detectChanges();
    });

    it('should have proper heading hierarchy', () => {
      const sectionTitle = fixture.debugElement.query(By.css('[data-testid="services-title"]'));
      expect(sectionTitle.nativeElement.tagName.toLowerCase()).toBe('h2');
    });

    it('should have service titles as h3', () => {
      const serviceTitles = fixture.debugElement.queryAll(By.css('[data-testid="service-title"]'));
      serviceTitles.forEach((title) => {
        expect(title.nativeElement.tagName.toLowerCase()).toBe('h3');
      });
    });

    it('should have accessible service cards', () => {
      const serviceCards = fixture.debugElement.queryAll(By.css('[data-testid="service-card"]'));
      serviceCards.forEach((card) => {
        // Cards should be keyboard accessible if interactive
        const isInteractive = card.nativeElement.hasAttribute('tabindex');
        const isButton = card.nativeElement.tagName.toLowerCase() === 'button';
        const isArticle = card.nativeElement.tagName.toLowerCase() === 'article';
        expect(isInteractive || isButton || isArticle).toBeTruthy();
      });
    });
  });

  describe('responsive behavior', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockServicesContent);
      fixture.detectChanges();
    });

    it('should render cards in a grid/flex container', () => {
      const container = fixture.debugElement.query(By.css('[data-testid="services-grid"]'));
      expect(container).toBeTruthy();
    });
  });
});
