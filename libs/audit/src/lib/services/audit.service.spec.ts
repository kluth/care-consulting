import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditService]
    });
    service = TestBed.inject(AuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should start an audit', () => {
    service.startAudit('tmpl_1').subscribe(run => {
      expect(run.id).toBe('run_1');
    });

    const req = httpMock.expectOne('/api/audit/start/tmpl_1');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'run_1' });
  });

  it('should save an answer', () => {
    service.saveAnswer('run_1', 'q_1', 'YES').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/audit/run/run_1/answer');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ questionId: 'q_1', value: 'YES' });
    req.flush({ success: true });
  });
});
