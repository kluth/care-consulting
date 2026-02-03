import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CareRole,
  ComplianceStatus,
  FortbildungCategory,
  FortbildungEntry,
  FortbildungPeriod,
  FortbildungCertificate,
  Prisma,
} from '@prisma/client';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

// CE Requirements per role (per year)
const REQUIREMENTS: Record<CareRole, { totalHours: number; periodYears: number; pedagogicalHours?: number }> = {
  PFLEGEFACHKRAFT: { totalHours: 16, periodYears: 2 },
  PRAXISANLEITER: { totalHours: 24, periodYears: 1, pedagogicalHours: 12 },
  PFLEGEHILFSKRAFT: { totalHours: 8, periodYears: 1 },
  PDL: { totalHours: 24, periodYears: 1 },
};

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

export interface CreateEntryDto {
  title: string;
  provider?: string;
  description?: string;
  hours: number;
  category: FortbildungCategory;
  trainingDate: Date;
  documentUrl?: string;
  isInternal?: boolean;
  courseId?: string;
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

@Injectable()
export class ComplianceTrackingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create the current period for a user
   */
  async getCurrentPeriod(userId: string): Promise<FortbildungPeriod> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { careRole: true },
    });

    if (!user?.careRole) {
      throw new BadRequestException('User does not have a care role assigned');
    }

    const now = new Date();
    const existingPeriod = await this.prisma.fortbildungPeriod.findFirst({
      where: {
        userId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (existingPeriod) {
      return existingPeriod;
    }

    // Create a new period based on role requirements
    const requirements = REQUIREMENTS[user.careRole];
    const startDate = new Date(now.getFullYear(), 0, 1); // Start of current year
    const endDate = new Date(
      now.getFullYear() + requirements.periodYears,
      0,
      0
    ); // End of period

    return this.prisma.fortbildungPeriod.create({
      data: {
        userId,
        startDate,
        endDate,
        careRole: user.careRole,
        requiredHours: requirements.totalHours,
        requiredPedagogicalHours: requirements.pedagogicalHours || 0,
      },
    });
  }

  /**
   * Calculate compliance status for a user's current period
   */
  async getComplianceStatus(userId: string): Promise<ComplianceStatusResult> {
    const period = await this.getCurrentPeriod(userId);
    const now = new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil(
        (period.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    const remainingHours = Math.max(
      0,
      period.requiredHours - period.completedHours
    );
    const remainingPedagogicalHours = Math.max(
      0,
      period.requiredPedagogicalHours - period.completedPedagogicalHours
    );
    const percentComplete = Math.min(
      100,
      (period.completedHours / period.requiredHours) * 100
    );

    // Determine status
    let status: ComplianceStatus;
    if (
      period.completedHours >= period.requiredHours &&
      period.completedPedagogicalHours >= period.requiredPedagogicalHours
    ) {
      status = ComplianceStatus.COMPLIANT;
    } else if (daysRemaining === 0) {
      status = ComplianceStatus.NON_COMPLIANT;
    } else if (daysRemaining <= 30 && remainingHours > 0) {
      status = ComplianceStatus.AT_RISK;
    } else {
      status = ComplianceStatus.IN_PROGRESS;
    }

    // Update period status if changed
    if (period.status !== status) {
      await this.prisma.fortbildungPeriod.update({
        where: { id: period.id },
        data: { status },
      });
    }

    return {
      status,
      completedHours: period.completedHours,
      requiredHours: period.requiredHours,
      completedPedagogicalHours: period.completedPedagogicalHours,
      requiredPedagogicalHours: period.requiredPedagogicalHours,
      remainingHours,
      remainingPedagogicalHours,
      daysRemaining,
      percentComplete,
    };
  }

  /**
   * Add a new training entry
   */
  async createEntry(
    userId: string,
    dto: CreateEntryDto
  ): Promise<FortbildungEntry> {
    // Validate training date is not in future
    if (dto.trainingDate > new Date()) {
      throw new BadRequestException('Training date cannot be in the future');
    }

    const period = await this.getCurrentPeriod(userId);

    const entry = await this.prisma.fortbildungEntry.create({
      data: {
        userId,
        periodId: period.id,
        title: dto.title,
        provider: dto.provider,
        description: dto.description,
        hours: dto.hours,
        category: dto.category,
        trainingDate: dto.trainingDate,
        documentUrl: dto.documentUrl,
        isInternal: dto.isInternal || false,
        courseId: dto.courseId,
      },
    });

    // Update period totals
    await this.updatePeriodTotals(period.id);

    return entry;
  }

  /**
   * Get all entries for a user's current period
   */
  async getEntries(userId: string): Promise<FortbildungEntry[]> {
    const period = await this.getCurrentPeriod(userId);

    return this.prisma.fortbildungEntry.findMany({
      where: { periodId: period.id },
      orderBy: { trainingDate: 'desc' },
    });
  }

  /**
   * Update period totals after adding/removing entries
   */
  private async updatePeriodTotals(periodId: string): Promise<void> {
    const entries = await this.prisma.fortbildungEntry.findMany({
      where: { periodId },
    });

    const completedHours = entries.reduce((sum, e) => sum + e.hours, 0);
    const completedPedagogicalHours = entries
      .filter((e) => e.category === FortbildungCategory.PAEDAGOGISCH)
      .reduce((sum, e) => sum + e.hours, 0);

    await this.prisma.fortbildungPeriod.update({
      where: { id: periodId },
      data: {
        completedHours,
        completedPedagogicalHours,
      },
    });
  }

  /**
   * Generate a compliance certificate (ADR-0016)
   */
  async generateCertificate(
    userId: string,
    periodId: string
  ): Promise<FortbildungCertificate> {
    const period = await this.prisma.fortbildungPeriod.findUnique({
      where: { id: periodId },
      include: { user: true },
    });

    if (!period) {
      throw new NotFoundException('Period not found');
    }

    if (period.userId !== userId) {
      throw new BadRequestException('Period does not belong to user');
    }

    // Check if requirements are met
    if (
      period.completedHours < period.requiredHours ||
      period.completedPedagogicalHours < period.requiredPedagogicalHours
    ) {
      throw new BadRequestException(
        'Continuing education requirements not yet met'
      );
    }

    // Check if certificate already exists
    const existingCert = await this.prisma.fortbildungCertificate.findUnique({
      where: { periodId },
    });

    if (existingCert) {
      return existingCert;
    }

    // Generate short ID for QR code URL
    const shortId = crypto.randomBytes(8).toString('base64url');

    // Create JWT token (RS256 signing would use private key in production)
    const jwtPayload = {
      sub: userId,
      periodId,
      userName: period.user.name,
      careRole: period.careRole,
      totalHours: period.completedHours,
      pedagogicalHours: period.completedPedagogicalHours,
      periodStart: period.startDate.toISOString(),
      periodEnd: period.endDate.toISOString(),
      issuedAt: new Date().toISOString(),
    };

    // In production, use RS256 with private key
    // For now, use a symmetric secret (HS256)
    const jwtToken = jwt.sign(jwtPayload, process.env['JWT_SECRET'] || 'dev-secret', {
      algorithm: 'HS256',
      expiresIn: '10y',
    });

    return this.prisma.fortbildungCertificate.create({
      data: {
        userId,
        periodId,
        shortId,
        jwtToken,
        totalHours: period.completedHours,
        pedagogicalHours: period.completedPedagogicalHours,
      },
    });
  }

  /**
   * Verify a certificate by short ID (public endpoint)
   */
  async verifyCertificate(shortId: string): Promise<{
    valid: boolean;
    certificate?: FortbildungCertificate & {
      period: FortbildungPeriod;
      user: { name: string | null };
    };
    error?: string;
  }> {
    const certificate = await this.prisma.fortbildungCertificate.findUnique({
      where: { shortId },
      include: {
        period: true,
        user: { select: { name: true } },
      },
    });

    if (!certificate) {
      return { valid: false, error: 'Certificate not found' };
    }

    if (certificate.isRevoked) {
      return {
        valid: false,
        error: `Certificate revoked: ${certificate.revokedReason}`,
      };
    }

    // Verify JWT signature
    try {
      jwt.verify(certificate.jwtToken, process.env['JWT_SECRET'] || 'dev-secret');
    } catch {
      return { valid: false, error: 'Certificate signature invalid' };
    }

    return { valid: true, certificate };
  }

  /**
   * Get team compliance dashboard (for PDL/managers)
   */
  async getTeamCompliance(
    managerId: string,
    facilityId: string,
    filters?: {
      status?: ComplianceStatus;
      sortBy?: 'deadline' | 'name' | 'progress';
      page?: number;
      limit?: number;
    }
  ): Promise<{ members: TeamMemberCompliance[]; total: number }> {
    // Verify manager has PDL role
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
      select: { careRole: true },
    });

    if (manager?.careRole !== CareRole.PDL) {
      throw new BadRequestException('Only PDL can access team dashboard');
    }

    const where: Prisma.UserWhereInput = {
      facilityId,
      careRole: { not: null },
    };

    const total = await this.prisma.user.count({ where });

    const users = await this.prisma.user.findMany({
      where,
      include: {
        fortbildungPeriods: {
          where: {
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
          take: 1,
        },
      },
      skip: ((filters?.page || 1) - 1) * (filters?.limit || 20),
      take: filters?.limit || 20,
    });

    const members: TeamMemberCompliance[] = users.map((user) => {
      const period = user.fortbildungPeriods[0];
      const daysRemaining = period
        ? Math.max(
            0,
            Math.ceil(
              (period.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
          )
        : 0;

      return {
        userId: user.id,
        userName: user.name || user.email,
        email: user.email,
        careRole: user.careRole!,
        status: period?.status || ComplianceStatus.IN_PROGRESS,
        completedHours: period?.completedHours || 0,
        requiredHours: period?.requiredHours || 0,
        daysRemaining,
        percentComplete: period
          ? Math.min(100, (period.completedHours / period.requiredHours) * 100)
          : 0,
      };
    });

    // Apply status filter
    let filtered = members;
    if (filters?.status) {
      filtered = members.filter((m) => m.status === filters.status);
    }

    // Apply sorting
    if (filters?.sortBy === 'deadline') {
      filtered.sort((a, b) => a.daysRemaining - b.daysRemaining);
    } else if (filters?.sortBy === 'progress') {
      filtered.sort((a, b) => a.percentComplete - b.percentComplete);
    } else {
      filtered.sort((a, b) => a.userName.localeCompare(b.userName));
    }

    return { members: filtered, total };
  }

  /**
   * Calculate pro-rated requirements for mid-period joiners
   */
  calculateProRatedRequirements(
    careRole: CareRole,
    startDate: Date,
    periodEndDate: Date
  ): { totalHours: number; pedagogicalHours: number } {
    const requirements = REQUIREMENTS[careRole];
    const fullPeriodDays = requirements.periodYears * 365;
    const remainingDays = Math.ceil(
      (periodEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const ratio = remainingDays / fullPeriodDays;

    return {
      totalHours: Math.ceil(requirements.totalHours * ratio),
      pedagogicalHours: Math.ceil(
        (requirements.pedagogicalHours || 0) * ratio
      ),
    };
  }
}
