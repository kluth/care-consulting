import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditRun {
  id: string;
  template: {
    title: string;
    sections: {
      id: string;
      title: string;
      questions: {
        id: string;
        text: string;
        points: number;
      }[];
    }[];
  };
  answers: { questionId: string; value: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = '/api/audit';

  startAudit(templateId: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/start/${templateId}`, {});
  }

  getRun(runId: string): Observable<AuditRun> {
    return this.http.get<AuditRun>(`${this.apiUrl}/run/${runId}`);
  }

  saveAnswer(runId: string, questionId: string, value: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/run/${runId}/answer`, { questionId, value });
  }
}
