import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeDisplayComponent } from './badge-display.component';

describe('BadgeDisplayComponent', () => {
  let component: BadgeDisplayComponent;
  let fixture: ComponentFixture<BadgeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeDisplayComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('badges', [
      { id: 'b1', name: 'First Steps', icon: 'star' }
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display badges', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('First Steps');
  });

  it('should show empty state if no badges', () => {
    fixture.componentRef.setInput('badges', []);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Noch keine Abzeichen');
  });
});
