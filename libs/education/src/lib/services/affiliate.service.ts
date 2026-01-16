import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {
  private http = inject(HttpClient);
  private apiUrl = '/api/affiliate';

  generateCode(): Observable<{ code: string }> {
    return this.http.post<{ code: string }>(`${this.apiUrl}/generate-code`, {});
  }
}
