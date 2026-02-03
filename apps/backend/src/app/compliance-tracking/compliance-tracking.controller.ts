import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ComplianceTrackingService, CreateEntryDto } from './compliance-tracking.service';
import { ComplianceStatus } from '@prisma/client';

interface AuthenticatedRequest {
  user: { sub: string; [key: string]: unknown };
}

@Controller('compliance-tracking')
export class ComplianceTrackingController {
  constructor(private readonly complianceTrackingService: ComplianceTrackingService) {}

  /**
   * Get current user's compliance status
   * GET /api/compliance-tracking/status
   */
  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  async getStatus(@Request() req: AuthenticatedRequest) {
    return this.complianceTrackingService.getComplianceStatus(req.user.sub);
  }

  /**
   * Get current user's training entries
   * GET /api/compliance-tracking/entries
   */
  @Get('entries')
  @UseGuards(AuthGuard('jwt'))
  async getEntries(@Request() req: AuthenticatedRequest) {
    return this.complianceTrackingService.getEntries(req.user.sub);
  }

  /**
   * Add a new training entry
   * POST /api/compliance-tracking/entries
   */
  @Post('entries')
  @UseGuards(AuthGuard('jwt'))
  async createEntry(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateEntryDto
  ) {
    return this.complianceTrackingService.createEntry(req.user.sub, dto);
  }

  /**
   * Generate compliance certificate
   * POST /api/compliance-tracking/certificate/:periodId
   */
  @Post('certificate/:periodId')
  @UseGuards(AuthGuard('jwt'))
  async generateCertificate(
    @Request() req: AuthenticatedRequest,
    @Param('periodId') periodId: string
  ) {
    return this.complianceTrackingService.generateCertificate(req.user.sub, periodId);
  }

  /**
   * Verify certificate (PUBLIC - no auth required)
   * GET /api/compliance-tracking/verify/:shortId
   */
  @Get('verify/:shortId')
  async verifyCertificate(@Param('shortId') shortId: string) {
    return this.complianceTrackingService.verifyCertificate(shortId);
  }

  /**
   * Get team compliance dashboard (PDL only)
   * GET /api/compliance-tracking/team
   */
  @Get('team')
  @UseGuards(AuthGuard('jwt'))
  async getTeamCompliance(
    @Request() req: AuthenticatedRequest,
    @Query('facilityId') facilityId: string,
    @Query('status') status?: ComplianceStatus,
    @Query('sortBy') sortBy?: 'deadline' | 'name' | 'progress',
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.complianceTrackingService.getTeamCompliance(req.user.sub, facilityId, {
      status,
      sortBy,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
