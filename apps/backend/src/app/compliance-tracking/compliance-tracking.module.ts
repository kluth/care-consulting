import { Module } from '@nestjs/common';
import { ComplianceTrackingController } from './compliance-tracking.controller';
import { ComplianceTrackingService } from './compliance-tracking.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComplianceTrackingController],
  providers: [ComplianceTrackingService],
  exports: [ComplianceTrackingService],
})
export class ComplianceTrackingModule {}
