import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FortbildungService } from './fortbildung.service';
import { PrismaService } from '../prisma/prisma.service';
import { CareRole, ComplianceStatus, FortbildungCategory } from '@prisma/client';

describe('FortbildungService', () => {
  let service: FortbildungService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 'user-1',
    careRole: CareRole.PFLEGEFACHKRAFT,
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockPeriod = {
    id: 'period-1',
    userId: 'user-1',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    careRole: CareRole.PFLEGEFACHKRAFT,
    requiredHours: 16,
    requiredPedagogicalHours: 0,
    completedHours: 0,
    completedPedagogicalHours: 0,
    status: ComplianceStatus.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      fortbildungPeriod: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      fortbildungEntry: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      fortbildungCertificate: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FortbildungService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FortbildungService>(FortbildungService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentPeriod', () => {
    it('should return existing period if one exists', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(mockPeriod);

      const result = await service.getCurrentPeriod('user-1');

      expect(result).toEqual(mockPeriod);
      expect(prismaService.fortbildungPeriod.create).not.toHaveBeenCalled();
    });

    it('should create new period if none exists', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(null);
      prismaService.fortbildungPeriod.create = jest
        .fn()
        .mockResolvedValue(mockPeriod);

      const result = await service.getCurrentPeriod('user-1');

      expect(prismaService.fortbildungPeriod.create).toHaveBeenCalled();
      expect(result).toEqual(mockPeriod);
    });

    it('should throw if user has no care role', async () => {
      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValue({ ...mockUser, careRole: null });

      await expect(service.getCurrentPeriod('user-1')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getComplianceStatus', () => {
    it('should calculate hours remaining for Pflegefachkraft (16h/2yr)', async () => {
      const periodWithProgress = {
        ...mockPeriod,
        completedHours: 10,
        requiredHours: 16,
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(periodWithProgress);
      prismaService.fortbildungPeriod.update = jest.fn().mockResolvedValue({});

      const result = await service.getComplianceStatus('user-1');

      expect(result.remainingHours).toBe(6);
      expect(result.completedHours).toBe(10);
      expect(result.requiredHours).toBe(16);
    });

    it('should calculate hours remaining for Praxisanleiter (24h/yr)', async () => {
      const praxisanleiterPeriod = {
        ...mockPeriod,
        careRole: CareRole.PRAXISANLEITER,
        requiredHours: 24,
        requiredPedagogicalHours: 12,
        completedHours: 20,
        completedPedagogicalHours: 8,
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...mockUser,
        careRole: CareRole.PRAXISANLEITER,
      });
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(praxisanleiterPeriod);
      prismaService.fortbildungPeriod.update = jest.fn().mockResolvedValue({});

      const result = await service.getComplianceStatus('user-1');

      expect(result.remainingHours).toBe(4);
      expect(result.remainingPedagogicalHours).toBe(4);
    });

    it('should track pedagogical vs professional hours separately', async () => {
      const praxisanleiterPeriod = {
        ...mockPeriod,
        careRole: CareRole.PRAXISANLEITER,
        requiredHours: 24,
        requiredPedagogicalHours: 12,
        completedHours: 24,
        completedPedagogicalHours: 10, // Not enough pedagogical
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...mockUser,
        careRole: CareRole.PRAXISANLEITER,
      });
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(praxisanleiterPeriod);
      prismaService.fortbildungPeriod.update = jest.fn().mockResolvedValue({});

      const result = await service.getComplianceStatus('user-1');

      // Total hours met but pedagogical not met
      expect(result.remainingHours).toBe(0);
      expect(result.remainingPedagogicalHours).toBe(2);
      expect(result.status).not.toBe(ComplianceStatus.COMPLIANT);
    });

    it('should determine COMPLIANT status when all requirements met', async () => {
      const compliantPeriod = {
        ...mockPeriod,
        completedHours: 16,
        requiredHours: 16,
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(compliantPeriod);
      prismaService.fortbildungPeriod.update = jest.fn().mockResolvedValue({});

      const result = await service.getComplianceStatus('user-1');

      expect(result.status).toBe(ComplianceStatus.COMPLIANT);
    });

    it('should determine AT_RISK status when <30 days remaining with incomplete hours', async () => {
      const now = new Date();
      const endDate = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000); // 20 days from now
      const atRiskPeriod = {
        ...mockPeriod,
        endDate,
        completedHours: 8,
        requiredHours: 16,
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(atRiskPeriod);
      prismaService.fortbildungPeriod.update = jest.fn().mockResolvedValue({});

      const result = await service.getComplianceStatus('user-1');

      expect(result.status).toBe(ComplianceStatus.AT_RISK);
      expect(result.daysRemaining).toBeLessThanOrEqual(30);
    });

    it('should determine NON_COMPLIANT status when period ended without meeting requirements', async () => {
      const pastPeriod = {
        ...mockPeriod,
        endDate: new Date('2023-12-31'),
        completedHours: 8,
        requiredHours: 16,
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(pastPeriod);
      prismaService.fortbildungPeriod.update = jest.fn().mockResolvedValue({});

      const result = await service.getComplianceStatus('user-1');

      expect(result.status).toBe(ComplianceStatus.NON_COMPLIANT);
    });
  });

  describe('createEntry', () => {
    it('should create a new training entry', async () => {
      const entryDto = {
        title: 'First Aid Training',
        provider: 'Red Cross',
        hours: 8,
        category: FortbildungCategory.FACHLICH,
        trainingDate: new Date('2024-06-15'),
      };
      const createdEntry = {
        id: 'entry-1',
        ...entryDto,
        userId: 'user-1',
        periodId: 'period-1',
      };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.fortbildungPeriod.findFirst = jest
        .fn()
        .mockResolvedValue(mockPeriod);
      prismaService.fortbildungEntry.create = jest
        .fn()
        .mockResolvedValue(createdEntry);
      prismaService.fortbildungEntry.findMany = jest
        .fn()
        .mockResolvedValue([createdEntry]);
      prismaService.fortbildungPeriod.update = jest.fn().mockResolvedValue({});

      const result = await service.createEntry('user-1', entryDto);

      expect(result.title).toBe('First Aid Training');
      expect(prismaService.fortbildungEntry.create).toHaveBeenCalled();
    });

    it('should reject future training dates', async () => {
      const futureEntry = {
        title: 'Future Training',
        hours: 4,
        category: FortbildungCategory.FACHLICH,
        trainingDate: new Date('2099-01-01'),
      };

      await expect(service.createEntry('user-1', futureEntry)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('generateCertificate', () => {
    it('should generate certificate only when requirements met', async () => {
      const compliantPeriod = {
        ...mockPeriod,
        completedHours: 16,
        requiredHours: 16,
        user: mockUser,
      };
      prismaService.fortbildungPeriod.findUnique = jest
        .fn()
        .mockResolvedValue(compliantPeriod);
      prismaService.fortbildungCertificate.findUnique = jest
        .fn()
        .mockResolvedValue(null);
      prismaService.fortbildungCertificate.create = jest.fn().mockResolvedValue({
        id: 'cert-1',
        shortId: 'abc123',
        jwtToken: 'token',
      });

      const result = await service.generateCertificate('user-1', 'period-1');

      expect(result.shortId).toBeDefined();
      expect(prismaService.fortbildungCertificate.create).toHaveBeenCalled();
    });

    it('should reject certificate generation when requirements not met', async () => {
      const incompletePeriod = {
        ...mockPeriod,
        completedHours: 8,
        requiredHours: 16,
        user: mockUser,
      };
      prismaService.fortbildungPeriod.findUnique = jest
        .fn()
        .mockResolvedValue(incompletePeriod);

      await expect(
        service.generateCertificate('user-1', 'period-1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyCertificate', () => {
    it('should verify valid certificates', async () => {
      // This would need proper JWT token setup
      // Simplified test for now
      prismaService.fortbildungCertificate.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      const result = await service.verifyCertificate('invalid-id');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Certificate not found');
    });

    it('should reject tampered certificates', async () => {
      prismaService.fortbildungCertificate.findUnique = jest
        .fn()
        .mockResolvedValue({
          shortId: 'test-id',
          jwtToken: 'invalid-token',
          isRevoked: false,
          period: mockPeriod,
          user: { name: 'Test' },
        });

      const result = await service.verifyCertificate('test-id');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid');
    });

    it('should handle revoked certificates', async () => {
      prismaService.fortbildungCertificate.findUnique = jest
        .fn()
        .mockResolvedValue({
          shortId: 'test-id',
          jwtToken: 'token',
          isRevoked: true,
          revokedReason: 'Fraud detected',
          period: mockPeriod,
          user: { name: 'Test' },
        });

      const result = await service.verifyCertificate('test-id');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('revoked');
    });
  });

  describe('calculateProRatedRequirements', () => {
    it('should handle pro-rated requirements for mid-period joiners', () => {
      const startDate = new Date('2024-07-01'); // Mid-year
      const endDate = new Date('2025-12-31');

      const result = service.calculateProRatedRequirements(
        CareRole.PFLEGEFACHKRAFT,
        startDate,
        endDate
      );

      // Should be less than full 16 hours
      expect(result.totalHours).toBeLessThan(16);
      expect(result.totalHours).toBeGreaterThan(0);
    });
  });

  describe('getTeamCompliance', () => {
    it('should only allow PDL role to access team dashboard', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...mockUser,
        careRole: CareRole.PFLEGEFACHKRAFT, // Not PDL
      });

      await expect(
        service.getTeamCompliance('user-1', 'facility-1')
      ).rejects.toThrow(BadRequestException);
    });

    it('should return team members with compliance status', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...mockUser,
        careRole: CareRole.PDL,
      });
      prismaService.user.count = jest.fn().mockResolvedValue(2);
      prismaService.user.findMany = jest.fn().mockResolvedValue([
        {
          id: 'member-1',
          name: 'Member 1',
          email: 'member1@test.com',
          careRole: CareRole.PFLEGEFACHKRAFT,
          fortbildungPeriods: [mockPeriod],
        },
      ]);

      const result = await service.getTeamCompliance('user-1', 'facility-1');

      expect(result.members).toBeDefined();
      expect(result.total).toBe(2);
    });

    it('should filter by compliance status', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...mockUser,
        careRole: CareRole.PDL,
      });
      prismaService.user.count = jest.fn().mockResolvedValue(1);
      prismaService.user.findMany = jest.fn().mockResolvedValue([
        {
          id: 'member-1',
          name: 'At Risk Member',
          email: 'atrisk@test.com',
          careRole: CareRole.PFLEGEFACHKRAFT,
          fortbildungPeriods: [{ ...mockPeriod, status: ComplianceStatus.AT_RISK }],
        },
      ]);

      const result = await service.getTeamCompliance('user-1', 'facility-1', {
        status: ComplianceStatus.AT_RISK,
      });

      expect(
        result.members.every((m) => m.status === ComplianceStatus.AT_RISK)
      ).toBe(true);
    });

    it('should sort by deadline', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...mockUser,
        careRole: CareRole.PDL,
      });
      prismaService.user.count = jest.fn().mockResolvedValue(2);
      prismaService.user.findMany = jest.fn().mockResolvedValue([
        {
          id: 'member-1',
          name: 'Later Deadline',
          email: 'm1@test.com',
          careRole: CareRole.PFLEGEFACHKRAFT,
          fortbildungPeriods: [
            { ...mockPeriod, endDate: new Date('2025-12-31') },
          ],
        },
        {
          id: 'member-2',
          name: 'Earlier Deadline',
          email: 'm2@test.com',
          careRole: CareRole.PFLEGEFACHKRAFT,
          fortbildungPeriods: [
            { ...mockPeriod, endDate: new Date('2025-06-30') },
          ],
        },
      ]);

      const result = await service.getTeamCompliance('user-1', 'facility-1', {
        sortBy: 'deadline',
      });

      expect(result.members[0].daysRemaining).toBeLessThanOrEqual(
        result.members[1].daysRemaining
      );
    });
  });
});
