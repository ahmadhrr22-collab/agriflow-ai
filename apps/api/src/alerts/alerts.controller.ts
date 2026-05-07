import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.alertsService.findAll(status);
  }

  @Get('unread-count')
  getUnreadCount() {
    return this.alertsService.getUnreadCount();
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.alertsService.markAsRead(id);
  }

  @Patch(':id/dismiss')
  dismiss(@Param('id') id: string) {
    return this.alertsService.dismiss(id);
  }
}