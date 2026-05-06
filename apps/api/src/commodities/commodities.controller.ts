import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CommoditiesService } from './commodities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('commodities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commodities')
export class CommoditiesController {
  constructor(private commoditiesService: CommoditiesService) {}

  @Get()
  findAll() {
    return this.commoditiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commoditiesService.findOne(id);
  }
}