import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AboutComponent } from './about.component';
import { AboutContent, TeamMember } from '../../models/content.model';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  const mockTeamMember: TeamMember = {
    id: 'founder',
    name: 'Dr. Anna Berger',
    role: 'Gründerin & Pflegeberaterin',
    bio: 'Über 15 Jahre Erfahrung in der Pflegebranche. Spezialisiert auf Qualitätsmanagement und Mitarbeiterentwicklung.',
    photo: '/assets/team/anna.jpg',
    credentials: ['Pflegewissenschaftlerin (M.Sc.)', 'Qualitätsauditorin (TÜV)', 'Systemische Beraterin'],
    linkedIn: 'https://linkedin.com/in/anna-berger',
  };

  const mockAboutContent: AboutContent = {
    sectionTitle: 'Über mich',
    introduction: 'Erfahren Sie mehr über meine Mission und meinen Hintergrund.',
    team: [mockTeamMember],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
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
      fixture.componentRef.setInput('content', mockAboutContent);
      fixture.detectChanges();
    });

    it('should display section title', () => {
      const title = fixture.debugElement.query(By.css('[data-testid="about-title"]'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain(mockAboutContent.sectionTitle);
    });

    it('should display introduction when provided', () => {
      const intro = fixture.debugElement.query(By.css('[data-testid="about-introduction"]'));
      expect(intro).toBeTruthy();
      expect(intro.nativeElement.textContent).toContain(mockAboutContent.introduction);
    });

    it('should display team member name', () => {
      const name = fixture.debugElement.query(By.css('[data-testid="member-name"]'));
      expect(name).toBeTruthy();
      expect(name.nativeElement.textContent).toContain(mockTeamMember.name);
    });

    it('should display team member role', () => {
      const role = fixture.debugElement.query(By.css('[data-testid="member-role"]'));
      expect(role).toBeTruthy();
      expect(role.nativeElement.textContent).toContain(mockTeamMember.role);
    });

    it('should display team member bio', () => {
      const bio = fixture.debugElement.query(By.css('[data-testid="member-bio"]'));
      expect(bio).toBeTruthy();
      expect(bio.nativeElement.textContent).toContain(mockTeamMember.bio);
    });

    it('should display team member photo when available', () => {
      const photo = fixture.debugElement.query(By.css('[data-testid="member-photo"]'));
      expect(photo).toBeTruthy();
      expect(photo.nativeElement.getAttribute('src')).toBe(mockTeamMember.photo);
    });

    it('should display credentials list', () => {
      const credentials = fixture.debugElement.queryAll(By.css('[data-testid="member-credential"]'));
      expect(credentials.length).toBe(mockTeamMember.credentials?.length);
      mockTeamMember.credentials?.forEach((credential, index) => {
        expect(credentials[index].nativeElement.textContent).toContain(credential);
      });
    });

    it('should display LinkedIn link when available', () => {
      const linkedInLink = fixture.debugElement.query(By.css('[data-testid="member-linkedin"]'));
      expect(linkedInLink).toBeTruthy();
      expect(linkedInLink.nativeElement.getAttribute('href')).toBe(mockTeamMember.linkedIn);
    });
  });

  describe('multiple team members', () => {
    const multiTeam: TeamMember[] = [
      mockTeamMember,
      {
        id: 'member-2',
        name: 'Stefan Koch',
        role: 'Senior Berater',
        bio: 'Experte für Digitalisierung in der Pflege.',
      },
    ];

    const multiTeamContent: AboutContent = {
      sectionTitle: 'Unser Team',
      team: multiTeam,
    };

    beforeEach(() => {
      fixture.componentRef.setInput('content', multiTeamContent);
      fixture.detectChanges();
    });

    it('should display all team members', () => {
      const memberCards = fixture.debugElement.queryAll(By.css('[data-testid="member-card"]'));
      expect(memberCards.length).toBe(multiTeam.length);
    });
  });

  describe('edge cases', () => {
    it('should handle missing introduction', () => {
      const contentNoIntro: AboutContent = {
        sectionTitle: 'About',
        team: [mockTeamMember],
      };
      fixture.componentRef.setInput('content', contentNoIntro);
      fixture.detectChanges();

      const intro = fixture.debugElement.query(By.css('[data-testid="about-introduction"]'));
      expect(intro).toBeFalsy();
    });

    it('should handle team member without photo', () => {
      const memberNoPhoto: TeamMember = {
        id: 'no-photo',
        name: 'Test Person',
        role: 'Role',
        bio: 'Bio text',
      };
      const contentNoPhoto: AboutContent = {
        sectionTitle: 'About',
        team: [memberNoPhoto],
      };
      fixture.componentRef.setInput('content', contentNoPhoto);
      fixture.detectChanges();

      const photo = fixture.debugElement.query(By.css('[data-testid="member-photo"]'));
      // Should show placeholder or no image
      expect(photo?.nativeElement?.getAttribute('src')).not.toBe(mockTeamMember.photo);
    });

    it('should handle team member without credentials', () => {
      const memberNoCredentials: TeamMember = {
        id: 'no-creds',
        name: 'Test Person',
        role: 'Role',
        bio: 'Bio text',
      };
      const contentNoCredentials: AboutContent = {
        sectionTitle: 'About',
        team: [memberNoCredentials],
      };
      fixture.componentRef.setInput('content', contentNoCredentials);
      fixture.detectChanges();

      const credentialsList = fixture.debugElement.query(By.css('[data-testid="credentials-list"]'));
      expect(credentialsList).toBeFalsy();
    });

    it('should handle team member without LinkedIn', () => {
      const memberNoLinkedIn: TeamMember = {
        id: 'no-linkedin',
        name: 'Test Person',
        role: 'Role',
        bio: 'Bio text',
      };
      const contentNoLinkedIn: AboutContent = {
        sectionTitle: 'About',
        team: [memberNoLinkedIn],
      };
      fixture.componentRef.setInput('content', contentNoLinkedIn);
      fixture.detectChanges();

      const linkedInLink = fixture.debugElement.query(By.css('[data-testid="member-linkedin"]'));
      expect(linkedInLink).toBeFalsy();
    });

    it('should handle empty team array', () => {
      const emptyContent: AboutContent = {
        sectionTitle: 'About',
        team: [],
      };
      fixture.componentRef.setInput('content', emptyContent);
      fixture.detectChanges();

      const memberCards = fixture.debugElement.queryAll(By.css('[data-testid="member-card"]'));
      expect(memberCards.length).toBe(0);
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('content', mockAboutContent);
      fixture.detectChanges();
    });

    it('should have section title as h2', () => {
      const title = fixture.debugElement.query(By.css('[data-testid="about-title"]'));
      expect(title.nativeElement.tagName.toLowerCase()).toBe('h2');
    });

    it('should have member name as h3', () => {
      const name = fixture.debugElement.query(By.css('[data-testid="member-name"]'));
      expect(name.nativeElement.tagName.toLowerCase()).toBe('h3');
    });

    it('should have alt text on member photo', () => {
      const photo = fixture.debugElement.query(By.css('[data-testid="member-photo"]'));
      expect(photo.nativeElement.getAttribute('alt')).toBeTruthy();
      expect(photo.nativeElement.getAttribute('alt')).toContain(mockTeamMember.name);
    });

    it('should have LinkedIn link open in new tab with proper attributes', () => {
      const linkedInLink = fixture.debugElement.query(By.css('[data-testid="member-linkedin"]'));
      expect(linkedInLink.nativeElement.getAttribute('target')).toBe('_blank');
      expect(linkedInLink.nativeElement.getAttribute('rel')).toContain('noopener');
    });
  });
});
