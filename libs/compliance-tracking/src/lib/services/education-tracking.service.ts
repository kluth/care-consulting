import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {
  ComplianceStatusResult,
  EducationEntry,
  CreateEntryDto,
  EducationCertificate,
  CertificateVerificationResult,
  TeamComplianceResult,
  TeamComplianceFilters,
} from '../models/education-tracking.model';

@Injectable({
  providedIn: 'root',
})
export class EducationTrackingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/fortbildung';

  // Reactive state for compliance status
  private readonly _complianceStatus$ =
    new BehaviorSubject<ComplianceStatusResult | null>(null);
  readonly complianceStatus$ = this._complianceStatus$.asObservable();

  private readonly _entries$ = new BehaviorSubject<EducationEntry[]>([]);
  readonly entries$ = this._entries$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _error$ = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error$.asObservable();

  /**
   * Get current user's compliance status
   */
  getComplianceStatus(): Observable<ComplianceStatusResult> {
    this._loading$.next(true);
    this._error$.next(null);

    return this.http.get<ComplianceStatusResult>(`${this.baseUrl}/status`).pipe(
      tap({
        next: (status) => {
          this._complianceStatus$.next(status);
          this._loading$.next(false);
        },
        error: (err) => {
          this._error$.next(err.message || 'Failed to load compliance status');
          this._loading$.next(false);
        },
      })
    );
  }

  /**
   * Get current user's training entries
   */
  getEntries(): Observable<EducationEntry[]> {
    this._loading$.next(true);
    this._error$.next(null);

    return this.http.get<EducationEntry[]>(`${this.baseUrl}/entries`).pipe(
      tap({
        next: (entries) => {
          this._entries$.next(entries);
          this._loading$.next(false);
        },
        error: (err) => {
          this._error$.next(err.message || 'Failed to load entries');
          this._loading$.next(false);
        },
      })
    );
  }

  /**
   * Add a new training entry
   */
  createEntry(dto: CreateEntryDto): Observable<EducationEntry> {
    this._loading$.next(true);
    this._error$.next(null);

    return this.http.post<EducationEntry>(`${this.baseUrl}/entries`, dto).pipe(
      tap({
        next: (entry) => {
          // Add to local state
          this._entries$.next([entry, ...this._entries$.getValue()]);
          this._loading$.next(false);
          // Refresh compliance status
          this.getComplianceStatus().subscribe();
        },
        error: (err) => {
          this._error$.next(err.message || 'Failed to create entry');
          this._loading$.next(false);
        },
      })
    );
  }

  /**
   * Generate compliance certificate
   */
  generateCertificate(periodId: string): Observable<EducationCertificate> {
    this._loading$.next(true);
    this._error$.next(null);

    return this.http
      .post<EducationCertificate>(
        `${this.baseUrl}/certificate/${periodId}`,
        {}
      )
      .pipe(
        tap({
          next: () => {
            this._loading$.next(false);
          },
          error: (err) => {
            this._error$.next(err.message || 'Failed to generate certificate');
            this._loading$.next(false);
          },
        })
      );
  }

  /**
   * Verify a certificate (public endpoint)
   */
  verifyCertificate(shortId: string): Observable<CertificateVerificationResult> {
    return this.http.get<CertificateVerificationResult>(
      `${this.baseUrl}/verify/${shortId}`
    );
  }

  /**
   * Get team compliance dashboard (PDL only)
   */
  getTeamCompliance(
    facilityId: string,
    filters?: TeamComplianceFilters
  ): Observable<TeamComplianceResult> {
    let params = new HttpParams().set('facilityId', facilityId);

    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters?.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters?.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<TeamComplianceResult>(`${this.baseUrl}/team`, {
      params,
    });
  }

  /**
   * Calculate remaining hours
   */
  getRemainingHours(): number {
    const status = this._complianceStatus$.getValue();
    return status?.remainingHours ?? 0;
  }

  /**
   * Calculate remaining pedagogical hours
   */
  getRemainingPedagogicalHours(): number {
    const status = this._complianceStatus$.getValue();
    return status?.remainingPedagogicalHours ?? 0;
  }

  /**
   * Check if user is at risk
   */
  isAtRisk(): boolean {
    const status = this._complianceStatus$.getValue();
    return status?.status === 'AT_RISK';
  }

  /**
   * Check if user is compliant
   */
  isCompliant(): boolean {
    const status = this._complianceStatus$.getValue();
    return status?.status === 'COMPLIANT';
  }
}
