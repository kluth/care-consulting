import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Badge {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  description?: string;
}

export interface GamificationProfile {
  xp: number;
  level: number;
  badges: Badge[];
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/gamification';

  getProfile(): Observable<GamificationProfile> {
    return this.http.get<GamificationProfile>(`${this.apiUrl}/profile`);
  }

  downloadCertificate(courseId: string): void {
    window.open(`${this.apiUrl}/certificate/${courseId}`, '_blank');
  }
}
