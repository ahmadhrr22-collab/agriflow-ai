import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricesService {
  constructor(private prisma: PrismaService) {}

  // Harga terbaru per komoditas per region
  async getLatestPrices(commodityId?: string, regionId?: string) {
    const where: any = {};
    if (commodityId) where.commodityId = commodityId;
    if (regionId) where.regionId = regionId;

    return this.prisma.priceRecord.findMany({
      where,
      include: {
        commodity: { select: { id: true, name: true, localName: true, unit: true } },
        region:    { select: { id: true, name: true, province: true } },
      },
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });
  }

  // Historis harga untuk chart (30 hari)
  async getPriceHistory(commodityId: string, regionId: string, days: number = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    return this.prisma.priceRecord.findMany({
      where: {
        commodityId,
        regionId,
        recordedAt: { gte: from },
      },
      orderBy: { recordedAt: 'asc' },
      select: {
        id:              true,
        price:           true,
        recordedAt:      true,
        confidenceScore: true,
        source:          true,
      },
    });
  }

  // Summary harga nasional per komoditas
  async getNationalSummary(commodityId: string) {
    const latest = await this.prisma.priceRecord.findMany({
      where: { commodityId },
      include: {
        region: { select: { name: true, province: true } },
      },
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });

    if (!latest.length) return null;

    const prices = latest.map((r) => r.price);
    const avg    = prices.reduce((a, b) => a + b, 0) / prices.length;
    const min    = Math.min(...prices);
    const max    = Math.max(...prices);

    // Region termahal dan termurah
    const sorted  = [...latest].sort((a, b) => b.price - a.price);
    const highest = sorted[0];
    const lowest  = sorted[sorted.length - 1];

    return {
      average:      Math.round(avg),
      min:          Math.round(min),
      max:          Math.round(max),
      spread:       Math.round(max - min),
      totalRegions: new Set(latest.map((r) => r.regionId)).size,
      highest: {
        price:  highest.price,
        region: highest.region.name,
      },
      lowest: {
        price:  lowest.price,
        region: lowest.region.name,
      },
      recordCount: latest.length,
    };
  }

  // Heatmap data — deviasi harga per region vs rata-rata nasional
  async getHeatmapData(commodityId: string) {
    const latest = await this.prisma.priceRecord.findMany({
      where: { commodityId },
      include: {
        region: true,
      },
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });

    if (!latest.length) return [];

    const prices    = latest.map((r) => r.price);
    const avgNational = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Ambil 1 record terbaru per region
    const byRegion = new Map<string, typeof latest[0]>();
    for (const record of latest) {
      if (!byRegion.has(record.regionId)) {
        byRegion.set(record.regionId, record);
      }
    }

    return Array.from(byRegion.values()).map((record) => ({
      regionId:   record.regionId,
      regionName: record.region.name,
      province:   record.region.province,
      latitude:   record.region.latitude,
      longitude:  record.region.longitude,
      price:      record.price,
      avgNational: Math.round(avgNational),
      deviation:   Math.round(((record.price - avgNational) / avgNational) * 100),
      recordedAt:  record.recordedAt,
      confidenceScore: record.confidenceScore,
    }));
  }
}