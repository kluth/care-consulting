import { Test, TestingModule } from '@nestjs/testing';
import { WellnessService } from './wellness.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WellnessService', () => {
  let service: WellnessService;
  let prisma: PrismaService;

  const mockPrisma = {
    wellnessCheckIn: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    burnoutAssessment: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WellnessService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WellnessService>(WellnessService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCheckIn', () => {
    it('should call prisma.wellnessCheckIn.create', async () => {
      const dto = { mood: 5, stress: 1, note: 'Feeling great' };
      const userId = 'user-1';
      
      await service.createCheckIn(userId, dto);
      
      expect(prisma.wellnessCheckIn.create).toHaveBeenCalledWith({
        data: { userId, ...dto },
      });
    });
  });
});
