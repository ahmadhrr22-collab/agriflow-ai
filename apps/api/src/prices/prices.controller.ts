import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PricesService } from './prices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('prices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Get()
  @ApiQuery({ name: 'commodityId', required: false })
  @ApiQuery({ name: 'regionId',    required: false })
  getLatest(
    @Query('commodityId') commodityId?: string,
    @Query('regionId')    regionId?: string,
  ) {
    return this.pricesService.getLatestPrices(commodityId, regionId);
  }

  @Get('history')
  @ApiQuery({ name: 'commodityId', required: true })
  @ApiQuery({ name: 'regionId',    required: true })
  @ApiQuery({ name: 'days',        required: false })
  getHistory(
    @Query('commodityId') commodityId: string,
    @Query('regionId')    regionId: string,
    @Query('days')        days?: string,
  ) {
    return this.pricesService.getPriceHistory(
      commodityId,
      regionId,
      days ? parseInt(days) : 30,
    );
  }

  @Get('national-summary')
  @ApiQuery({ name: 'commodityId', required: true })
  getNationalSummary(@Query('commodityId') commodityId: string) {
    return this.pricesService.getNationalSummary(commodityId);
  }

  @Get('heatmap')
  @ApiQuery({ name: 'commodityId', required: true })
  getHeatmap(@Query('commodityId') commodityId: string) {
    return this.pricesService.getHeatmapData(commodityId);
  }
}