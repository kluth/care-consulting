import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContentService } from './content.service';
import { LandingPageContent } from '../models/content.model';
import { firstValueFrom } from 'rxjs';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  const mockDeContent: LandingPageContent = {
    hero: {
      title: 'Professionelle Pflegeberatung',
      subtitle: 'Qualitätsmanagement · Schulungen · Prozessoptimierung',
      cta: 'Beratungstermin vereinbaren',
    },
    services: {
      sectionTitle: 'Unsere Leistungen',
      services: [
        {
          id: 'quality',
          title: 'Qualitätsmanagement',
          description: 'MDK-Audits und QM-Systeme',
          icon: 'quality-icon',
        },
      ],
    },
    education: {
      sectionTitle: 'Weiterbildung',
    },
    testimonials: {
      sectionTitle: 'Kundenstimmen',
      testimonials: [],
    },
    about: {
      sectionTitle: 'Über mich',
      team: [],
    },
    footer: {
      contact: { email: 'info@care-consulting.de' },
      copyright: '© 2026 Care Consulting',
    },
  };

  const mockEnContent: LandingPageContent = {
    hero: {
      title: 'Professional Care Consulting',
      subtitle: 'Quality Management · Training · Process Optimization',
      cta: 'Book a Consultation',
    },
    services: {
      sectionTitle: 'Our Services',
      services: [],
    },
    education: {
      sectionTitle: 'Education',
    },
    testimonials: {
      sectionTitle: 'Testimonials',
      testimonials: [],
    },
    about: {
      sectionTitle: 'About Us',
      team: [],
    },
    footer: {
      contact: { email: 'info@care-consulting.de' },
      copyright: '© 2026 Care Consulting',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentService],
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have isLoading signal initialized to false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have error signal initialized to null', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('loadContent', () => {
    it('should load German content by default', async () => {
      const contentPromise = firstValueFrom(service.loadContent());

      const req = httpMock.expectOne('/assets/content/de/landing.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockDeContent);

      const result = await contentPromise;
      expect(result).toEqual(mockDeContent);
    });

    it('should load content for specified language', async () => {
      const contentPromise = firstValueFrom(service.loadContent('en'));

      const req = httpMock.expectOne('/assets/content/en/landing.json');
      req.flush(mockEnContent);

      const result = await contentPromise;
      expect(result?.hero.title).toBe('Professional Care Consulting');
    });

    it('should set isLoading to true while loading', () => {
      service.loadContent().subscribe();
      expect(service.isLoading()).toBe(true);

      const req = httpMock.expectOne('/assets/content/de/landing.json');
      req.flush(mockDeContent);

      expect(service.isLoading()).toBe(false);
    });

    it('should clear error on successful load', async () => {
      service.error.set('Previous error');
      const contentPromise = firstValueFrom(service.loadContent());

      const req = httpMock.expectOne('/assets/content/de/landing.json');
      req.flush(mockDeContent);

      await contentPromise;
      expect(service.error()).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should set error signal on HTTP error', async () => {
      const contentPromise = firstValueFrom(service.loadContent()).catch(() => {});

      const req = httpMock.expectOne('/assets/content/de/landing.json');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });

      await contentPromise;
      expect(service.error()).toBeTruthy();
      expect(service.isLoading()).toBe(false);
    });

    it('should set isLoading to false on error', async () => {
      const contentPromise = firstValueFrom(service.loadContent()).catch(() => {});

      const req = httpMock.expectOne('/assets/content/de/landing.json');
      req.error(new ProgressEvent('Network error'));

      await contentPromise;
      expect(service.isLoading()).toBe(false);
    });

    it('should handle network errors', async () => {
      let error: Error | undefined;
      const contentPromise = firstValueFrom(service.loadContent()).catch((e) => {
        error = e;
      });

      const req = httpMock.expectOne('/assets/content/de/landing.json');
      req.error(new ProgressEvent('Network error'));

      await contentPromise;
      expect(error).toBeTruthy();
    });

    it('should fallback to default language on error if requested language unavailable', async () => {
      const contentPromise = firstValueFrom(service.loadContent('fr'));

      // First request for French fails
      const frReq = httpMock.expectOne('/assets/content/fr/landing.json');
      frReq.flush('Not found', { status: 404, statusText: 'Not Found' });

      // Should fallback to German
      const deReq = httpMock.expectOne('/assets/content/de/landing.json');
      deReq.flush(mockDeContent);

      const result = await contentPromise;
      expect(result).toEqual(mockDeContent);
    });
  });

  describe('caching', () => {
    it('should cache content for subsequent requests', async () => {
      // First request
      const firstPromise = firstValueFrom(service.loadContent('de'));
      const req1 = httpMock.expectOne('/assets/content/de/landing.json');
      req1.flush(mockDeContent);
      await firstPromise;

      // Second request should use cache
      const result = await firstValueFrom(service.loadContent('de'));

      httpMock.expectNone('/assets/content/de/landing.json');
      expect(result).toEqual(mockDeContent);
    });

    it('should not cache content for different languages', async () => {
      // First request for German
      const dePromise = firstValueFrom(service.loadContent('de'));
      const deReq = httpMock.expectOne('/assets/content/de/landing.json');
      deReq.flush(mockDeContent);
      await dePromise;

      // Second request for English should make new request
      const enPromise = firstValueFrom(service.loadContent('en'));
      const enReq = httpMock.expectOne('/assets/content/en/landing.json');
      enReq.flush(mockEnContent);
      await enPromise;

      // Verify both requests were made
    });

    it('should provide clearCache method', async () => {
      // Load and cache
      const firstPromise = firstValueFrom(service.loadContent('de'));
      const req1 = httpMock.expectOne('/assets/content/de/landing.json');
      req1.flush(mockDeContent);
      await firstPromise;

      // Clear cache
      service.clearCache();

      // Should make new request
      const secondPromise = firstValueFrom(service.loadContent('de'));
      const req2 = httpMock.expectOne('/assets/content/de/landing.json');
      req2.flush(mockDeContent);
      await secondPromise;
    });
  });

  describe('content validation', () => {
    it('should validate required content fields', async () => {
      const incompleteContent = {
        hero: { title: 'Test' },
        // Missing required fields
      };

      const contentPromise = firstValueFrom(service.loadContent()).catch(() => {});

      const req = httpMock.expectOne('/assets/content/de/landing.json');
      req.flush(incompleteContent);

      await contentPromise;
      // Should throw validation error or handle gracefully
      expect(service.error()).toBeTruthy();
    });
  });

  describe('getContentSection', () => {
    beforeEach(async () => {
      const contentPromise = firstValueFrom(service.loadContent());
      const req = httpMock.expectOne('/assets/content/de/landing.json');
      req.flush(mockDeContent);
      await contentPromise;
    });

    it('should return specific content section', () => {
      const hero = service.getContentSection('hero');
      expect(hero).toEqual(mockDeContent.hero);
    });

    it('should return undefined for non-existent section', () => {
      const invalid = service.getContentSection('nonExistent' as keyof LandingPageContent);
      expect(invalid).toBeUndefined();
    });
  });
});
