import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { WellnessService } from './wellness.service';
import { CreateCheckInDto, CreateAssessmentDto } from './dto';
// Assuming an AuthGuard exists based on ADR-0006
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('wellness')
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @Post('check-in')
  async createCheckIn(@Body() dto: CreateCheckInDto) {
    // In a real app, userId comes from req.user
    const mockUserId = 'cm1234567890'; 
    return this.wellnessService.createCheckIn(mockUserId, dto);
  }

  @Get('history')
  async getHistory() {
    const mockUserId = 'cm1234567890';
    return this.wellnessService.getCheckInHistory(mockUserId);
  }

  @Post('assessment')
  async createAssessment(@Body() dto: CreateAssessmentDto) {
    const mockUserId = 'cm1234567890';
    return this.wellnessService.createAssessment(mockUserId, dto);
  }
}
