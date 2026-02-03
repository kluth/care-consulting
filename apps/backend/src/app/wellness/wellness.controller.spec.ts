import { Test, TestingModule } from '@nestjs/testing';
import { WellnessController } from './wellness.controller';
import { WellnessService } from './wellness.service';

describe('WellnessController', () => {
  let controller: WellnessController;
  let service: WellnessService;

  const mockWellnessService = {
    createCheckIn: jest.fn(),
    getCheckInHistory: jest.fn(),
    createAssessment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WellnessController],
      providers: [
        { provide: WellnessService, useValue: mockWellnessService },
      ],
    }).compile();

    controller = module.get<WellnessController>(WellnessController);
    service = module.get<WellnessService>(WellnessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckIn', () => {
    it('should call wellnessService.createCheckIn', async () => {
      const dto = { mood: 4, stress: 2 };
      await controller.createCheckIn(dto);
      expect(service.createCheckIn).toHaveBeenCalledWith('cm1234567890', dto);
    });
  });
});
