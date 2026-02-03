import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckInDto, CreateAssessmentDto } from './dto';

@Injectable()
export class WellnessService {
  constructor(private prisma: PrismaService) {}

  async createCheckIn(userId: string, dto: CreateCheckInDto) {
    return this.prisma.wellnessCheckIn.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async getCheckInHistory(userId: string) {
    return this.prisma.wellnessCheckIn.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async createAssessment(userId: string, dto: CreateAssessmentDto) {
    return this.prisma.burnoutAssessment.create({
      data: {
        userId,
        score: dto.score,
        answers: dto.answers as any,
      },
    });
  }

  async getLatestAssessment(userId: string) {
    return this.prisma.burnoutAssessment.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
