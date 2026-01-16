import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseCatalogComponent } from './course-catalog.component';
import { CourseService } from '../../services/course.service';
import { PaymentService } from '../../services/payment.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('CourseCatalogComponent', () => {
  let component: CourseCatalogComponent;
  let fixture: ComponentFixture<CourseCatalogComponent>;
  let courseServiceMock: any;
  let paymentServiceMock: any;

  beforeEach(async () => {
    courseServiceMock = {
      getCourses: vi.fn().mockReturnValue(of([
        { id: '1', title: 'Test Course', price: 99 }
      ]))
    };

    paymentServiceMock = {
      redirectToCheckout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CourseCatalogComponent],
      providers: [
        provideRouter([]),
        { provide: CourseService, useValue: courseServiceMock },
        { provide: PaymentService, useValue: paymentServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    expect(courseServiceMock.getCourses).toHaveBeenCalled();
    expect(component.courses().length).toBe(1);
  });

  it('should display course titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Course');
  });
});
