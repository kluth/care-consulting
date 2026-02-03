// Care worker role types (German names kept for domain accuracy)
export type CareRole =
  | 'PFLEGEFACHKRAFT'
  | 'PRAXISANLEITER'
  | 'PFLEGEHILFSKRAFT'
  | 'PDL';

// Education category types
export type EducationCategory = 'FACHLICH' | 'PAEDAGOGISCH' | 'SONSTIGE';

export type ComplianceStatus =
  | 'IN_PROGRESS'
  | 'COMPLIANT'
  | 'AT_RISK'
  | 'NON_COMPLIANT';

export interface ComplianceStatusResult {
  status: ComplianceStatus;
  completedHours: number;
  requiredHours: number;
  completedPedagogicalHours: number;
  requiredPedagogicalHours: number;
  remainingHours: number;
  remainingPedagogicalHours: number;
  daysRemaining: number;
  percentComplete: number;
}

export interface EducationEntry {
  id: string;
  userId: string;
  periodId: string;
  title: string;
  provider?: string;
  description?: string;
  hours: number;
  category: EducationCategory;
  trainingDate: string;
  isInternal: boolean;
  courseId?: string;
  documentUrl?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryDto {
  title: string;
  provider?: string;
  description?: string;
  hours: number;
  category: EducationCategory;
  trainingDate: string;
  documentUrl?: string;
  isInternal?: boolean;
  courseId?: string;
}

export interface EducationPeriod {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  careRole: CareRole;
  requiredHours: number;
  requiredPedagogicalHours: number;
  completedHours: number;
  completedPedagogicalHours: number;
  status: ComplianceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EducationCertificate {
  id: string;
  userId: string;
  periodId: string;
  shortId: string;
  totalHours: number;
  pedagogicalHours: number;
  pdfUrl?: string;
  isRevoked: boolean;
  revokedAt?: string;
  revokedReason?: string;
  issuedAt: string;
}

export interface CertificateVerificationResult {
  valid: boolean;
  certificate?: EducationCertificate & {
    period: EducationPeriod;
    user: { name: string };
  };
  error?: string;
}

export interface TeamMemberCompliance {
  userId: string;
  userName: string;
  email: string;
  careRole: CareRole;
  status: ComplianceStatus;
  completedHours: number;
  requiredHours: number;
  daysRemaining: number;
  percentComplete: number;
}

export interface TeamComplianceResult {
  members: TeamMemberCompliance[];
  total: number;
}

export interface TeamComplianceFilters {
  status?: ComplianceStatus;
  sortBy?: 'deadline' | 'name' | 'progress';
  page?: number;
  limit?: number;
}

// i18n keys for display - actual translations handled by Transloco
export const CARE_ROLE_I18N_KEYS: Record<CareRole, string> = {
  PFLEGEFACHKRAFT: 'role.pflegefachkraft',
  PRAXISANLEITER: 'role.praxisanleiter',
  PFLEGEHILFSKRAFT: 'role.pflegehilfskraft',
  PDL: 'role.pdl',
};

export const CATEGORY_I18N_KEYS: Record<EducationCategory, string> = {
  FACHLICH: 'category.fachlich',
  PAEDAGOGISCH: 'category.paedagogisch',
  SONSTIGE: 'category.sonstige',
};

export const STATUS_I18N_KEYS: Record<ComplianceStatus, string> = {
  IN_PROGRESS: 'status.inProgress',
  COMPLIANT: 'status.compliant',
  AT_RISK: 'status.atRisk',
  NON_COMPLIANT: 'status.nonCompliant',
};
