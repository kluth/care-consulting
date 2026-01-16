import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EducationComponent } from './education.component';
import { EducationContent, WebinarInfo, Resource } from '../../models/content.model';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;

  const mockWebinar: WebinarInfo = {
    title: 'Qualitätsmanagement in der Pflege',
    description: 'Erfahren Sie, wie Sie Ihr QM-System optimieren können',
    date: '2026-02-15T14:00:00Z',
    duration: '90 Minuten',
    registrationCta: 'Jetzt anmelden',
  };

  const mockResources: Resource[] = [
    {
      id: 'guide-1',
      title: 'MDK-Prüfung Checkliste',
      description: 'Kostenlose Checkliste zur Vorbereitung',
      type: 'pdf',
      downloadUrl: '/assets/resources/mdk-checklist.pdf',
    },
    {
      id: 'video-1',
      title: 'Einführung ins Qualitätsmanagement',
      description: 'Kurzes Erklärvideo zu den Grundlagen',
      type: 'video',
    },
  ];

  const mockEducationContent: EducationContent = {
    sectionTitle: 'Weiterbildung',
    sectionSubtitle: 'Investieren Sie in Ihre Entwicklung',
    webinar: mockWebinar,
    resources: mockResources,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
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

  describe('webinar section', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockEducationContent);
      fixture.detectChanges();
    });

    it('should display webinar title', () => {
      const webinarTitle = fixture.debugElement.query(By.css('[data-testid="webinar-title"]'));
      expect(webinarTitle).toBeTruthy();
      expect(webinarTitle.nativeElement.textContent).toContain(mockWebinar.title);
    });

    it('should display webinar description', () => {
      const webinarDescription = fixture.debugElement.query(
        By.css('[data-testid="webinar-description"]'),
      );
      expect(webinarDescription).toBeTruthy();
      expect(webinarDescription.nativeElement.textContent).toContain(mockWebinar.description);
    });

    it('should display formatted webinar date', () => {
      const webinarDate = fixture.debugElement.query(By.css('[data-testid="webinar-date"]'));
      expect(webinarDate).toBeTruthy();
      // Date should be formatted for locale
      expect(webinarDate.nativeElement.textContent).toBeTruthy();
    });

    it('should display webinar duration', () => {
      const webinarDuration = fixture.debugElement.query(By.css('[data-testid="webinar-duration"]'));
      expect(webinarDuration).toBeTruthy();
      expect(webinarDuration.nativeElement.textContent).toContain(mockWebinar.duration);
    });

    it('should display registration CTA button', () => {
      const registrationBtn = fixture.debugElement.query(
        By.css('[data-testid="webinar-register-btn"]'),
      );
      expect(registrationBtn).toBeTruthy();
      expect(registrationBtn.nativeElement.textContent).toContain(mockWebinar.registrationCta);
    });

    it('should emit webinarRegister event when registration button is clicked', () => {
      const registerSpy = vi.fn();
      component.webinarRegister.subscribe(registerSpy);

      const registrationBtn = fixture.debugElement.query(
        By.css('[data-testid="webinar-register-btn"]'),
      );
      registrationBtn.nativeElement.click();

      expect(registerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('resources section', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockEducationContent);
      fixture.detectChanges();
    });

    it('should display all resources', () => {
      const resourceCards = fixture.debugElement.queryAll(By.css('[data-testid="resource-card"]'));
      expect(resourceCards.length).toBe(mockResources.length);
    });

    it('should display resource titles', () => {
      const resourceTitles = fixture.debugElement.queryAll(By.css('[data-testid="resource-title"]'));
      mockResources.forEach((resource, index) => {
        expect(resourceTitles[index].nativeElement.textContent).toContain(resource.title);
      });
    });

    it('should display resource descriptions', () => {
      const resourceDescriptions = fixture.debugElement.queryAll(
        By.css('[data-testid="resource-description"]'),
      );
      mockResources.forEach((resource, index) => {
        expect(resourceDescriptions[index].nativeElement.textContent).toContain(resource.description);
      });
    });

    it('should show download link for PDF resources', () => {
      const pdfResource = fixture.debugElement.queryAll(By.css('[data-testid="resource-card"]'))[0];
      const downloadLink = pdfResource.query(By.css('[data-testid="resource-download"]'));
      expect(downloadLink).toBeTruthy();
      expect(downloadLink.nativeElement.getAttribute('href')).toBe(mockResources[0].downloadUrl);
    });

    it('should emit resourceDownload event when download is clicked', () => {
      const downloadSpy = vi.fn();
      component.resourceDownload.subscribe(downloadSpy);

      const downloadLink = fixture.debugElement.query(By.css('[data-testid="resource-download"]'));
      downloadLink.nativeElement.click();

      expect(downloadSpy).toHaveBeenCalledWith(mockResources[0].id);
    });
  });

  describe('edge cases', () => {
    it('should handle content without webinar', () => {
      const contentNoWebinar: EducationContent = {
        sectionTitle: 'Education',
        resources: mockResources,
      };
      fixture.componentRef.setInput('content', contentNoWebinar);
      fixture.detectChanges();

      const webinarSection = fixture.debugElement.query(By.css('[data-testid="webinar-section"]'));
      expect(webinarSection).toBeFalsy();
    });

    it('should handle content without resources', () => {
      const contentNoResources: EducationContent = {
        sectionTitle: 'Education',
        webinar: mockWebinar,
      };
      fixture.componentRef.setInput('content', contentNoResources);
      fixture.detectChanges();

      const resourceCards = fixture.debugElement.queryAll(By.css('[data-testid="resource-card"]'));
      expect(resourceCards.length).toBe(0);
    });

    it('should handle empty resources array', () => {
      const contentEmptyResources: EducationContent = {
        sectionTitle: 'Education',
        resources: [],
      };
      fixture.componentRef.setInput('content', contentEmptyResources);
      fixture.detectChanges();

      const resourceCards = fixture.debugElement.queryAll(By.css('[data-testid="resource-card"]'));
      expect(resourceCards.length).toBe(0);
    });

    it('should handle resource without download URL', () => {
      fixture.componentRef.setInput('content', mockEducationContent);
      fixture.detectChanges();

      // Second resource (video) has no downloadUrl
      const videoResource = fixture.debugElement.queryAll(By.css('[data-testid="resource-card"]'))[1];
      const downloadLink = videoResource.query(By.css('[data-testid="resource-download"]'));
      expect(downloadLink).toBeFalsy();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockEducationContent);
      fixture.detectChanges();
    });

    it('should have section title as h2', () => {
      const sectionTitle = fixture.debugElement.query(By.css('[data-testid="education-title"]'));
      expect(sectionTitle.nativeElement.tagName.toLowerCase()).toBe('h2');
    });

    it('should have accessible registration button', () => {
      const registrationBtn = fixture.debugElement.query(
        By.css('[data-testid="webinar-register-btn"]'),
      );
      expect(registrationBtn.nativeElement.tagName.toLowerCase()).toBe('button');
    });

    it('should have proper datetime attribute for webinar date', () => {
      const webinarDate = fixture.debugElement.query(By.css('[data-testid="webinar-date"]'));
      // Should use <time> element with datetime attribute for screen readers
      expect(
        webinarDate.nativeElement.tagName.toLowerCase() === 'time' ||
          webinarDate.nativeElement.querySelector('time'),
      ).toBeTruthy();
    });
  });
});
