import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LevelProgressComponent } from './level-progress.component';

describe('LevelProgressComponent', () => {
  let component: LevelProgressComponent;
  let fixture: ComponentFixture<LevelProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelProgressComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('level', 5);
    fixture.componentRef.setInput('currentXp', 250);
    fixture.componentRef.setInput('nextLevelXp', 500);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current level', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const levelText = compiled.querySelector('.level-badge strong')?.textContent;
    expect(levelText).toBe('5');
  });

  it('should calculate progress percentage', () => {
    expect(component.progressPercentage()).toBe(50);
  });
});
