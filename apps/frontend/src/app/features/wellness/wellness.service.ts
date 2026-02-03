import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WellnessCheckIn {
  mood: number;
  stress: number;
  note?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WellnessService {
  private http = inject(HttpClient);
  private apiUrl = '/api/wellness';

  createCheckIn(checkIn: WellnessCheckIn): Observable<WellnessCheckIn> {
    return this.http.post<WellnessCheckIn>(`${this.apiUrl}/check-in`, checkIn);
  }

  getHistory(): Observable<WellnessCheckIn[]> {
    return this.http.get<WellnessCheckIn[]>(`${this.apiUrl}/history`);
  }
}
