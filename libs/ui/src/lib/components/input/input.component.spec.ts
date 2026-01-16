import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiInputComponent } from './input.component';
import { FormsModule, NgControl } from '@angular/forms';

describe('UiInputComponent', () => {
  let component: UiInputComponent;
  let fixture: ComponentFixture<UiInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiInputComponent, FormsModule],
      providers: [
        // Mock NgControl for CVA
        { provide: NgControl, useValue: { control: { valueChanges: { subscribe: () => {} } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Email');
  });
});
