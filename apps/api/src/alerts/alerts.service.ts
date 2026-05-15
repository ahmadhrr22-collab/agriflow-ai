import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type PricePoint = {
  commodityId: string;
  commodityName: string;
  regionId: string;
  regionName: string;
  recordedAt: Date;
  price: number;
};

type DailyPricePoint = PricePoint & {
  dateKey: string;
};

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: Prisma.AlertWhereInput = {};
    if (status && this.isAlertStatus(status)) where.status = status;

    return this.prisma.alert.findMany({
      where,
      include: {
        commodity: { select: { id: true, localName: true } },
        region: { select: { id: true, name: true, province: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { status: 'READ', readAt: new Date() },
    });
  }

  async dismiss(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { status: 'DISMISSED' },
    });
  }

  async getUnreadCount() {
    return this.prisma.alert.count({
      where: { status: { in: ['PENDING', 'SENT'] } },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async generateScheduledPriceAlerts() {
    await this.generateFromPriceRecords();
  }

  async generateFromPriceRecords() {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const records = await this.prisma.priceRecord.findMany({
      where: {
        recordedAt: { gte: since },
      },
      include: {
        commodity: { select: { localName: true } },
        region: { select: { name: true } },
      },
      orderBy: { recordedAt: 'asc' },
    });

    const grouped = new Map<string, PricePoint[]>();

    for (const record of records) {
      const key = `${record.commodityId}:${record.regionId}`;
      const value: PricePoint = {
        commodityId: record.commodityId,
        commodityName: record.commodity.localName,
        regionId: record.regionId,
        regionName: record.region.name,
        recordedAt: record.recordedAt,
        price: record.price,
      };

      grouped.set(key, [...(grouped.get(key) || []), value]);
    }

    let created = 0;

    for (const points of grouped.values()) {
      const daily = this.toDailyPrices(points);

      if (daily.length < 8) {
        continue;
      }

      const latest = daily[daily.length - 1];
      const baseline = daily.slice(Math.max(0, daily.length - 8), daily.length - 1);
      const avgPrice =
        baseline.reduce((sum, point) => sum + point.price, 0) / baseline.length;
      const stdDev = this.standardDeviation(baseline.map((point) => point.price));
      const pctChange = ((latest.price - avgPrice) / avgPrice) * 100;
      const zScore = stdDev > 0 ? (latest.price - avgPrice) / stdDev : 0;

      const absPctChange = Math.abs(pctChange);
      const absZScore = Math.abs(zScore);
      const isSpike =
        pctChange >= 20 ||
        (pctChange >= 12 && zScore >= 2.5);
      const isDrop =
        pctChange <= -20 ||
        (pctChange <= -12 && zScore <= -2.5);

      if (!isSpike && !isDrop) {
        continue;
      }

      const startOfDay = this.startOfDay(latest.recordedAt);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const type = isSpike ? 'PRICE_SPIKE' : 'PRICE_DROP';
      const existing = await this.prisma.alert.findFirst({
        where: {
          commodityId: latest.commodityId,
          regionId: latest.regionId,
          type,
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      if (existing) {
        continue;
      }

      const severity =
        absPctChange >= 30 ||
        (absPctChange >= 20 && absZScore >= 3.5)
          ? 'CRITICAL'
          : absPctChange >= 20 ||
              (absPctChange >= 15 && absZScore >= 3)
            ? 'HIGH'
            : 'MEDIUM';
      const direction = isSpike ? 'naik' : 'turun';

      await this.prisma.alert.create({
        data: {
          type,
          severity,
          commodityId: latest.commodityId,
          regionId: latest.regionId,
          title: `Harga ${latest.commodityName} ${direction}`,
          message:
            `Harga ${latest.commodityName} di ${latest.regionName} ${direction} ` +
            `${Math.abs(pctChange).toFixed(1)}% dibanding rata-rata 7 hari terakhir.`,
          metadata: {
            source: 'price_records',
            latestPrice: latest.price,
            baselineAvgPrice: Math.round(avgPrice),
            pctChange: Number(pctChange.toFixed(2)),
            zScore: Number(zScore.toFixed(2)),
            detectedForDate: latest.dateKey,
          },
          status: 'PENDING',
        },
      });

      created += 1;
    }

    return {
      success: true,
      source: 'price_records',
      groupsAnalyzed: grouped.size,
      alertsCreated: created,
    };
  }

  async createFromAnomaly(data: {
    type:
      | 'PRICE_SPIKE'
      | 'PRICE_DROP'
      | 'SUPPLY_SHORTAGE'
      | 'DEMAND_SURGE'
      | 'ANOMALY_DETECTED';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    message: string;
    commodityId: string;
    regionId: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.alert.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  async seedDemoAlerts() {
    return;
  }

  private toDailyPrices(points: PricePoint[]): DailyPricePoint[] {
    const byDate = new Map<string, PricePoint[]>();

    for (const point of points) {
      const dateKey = point.recordedAt.toISOString().slice(0, 10);
      byDate.set(dateKey, [...(byDate.get(dateKey) || []), point]);
    }

    return Array.from(byDate.entries())
      .map(([dateKey, dayPoints]) => {
        const latest = dayPoints[dayPoints.length - 1];
        const price =
          dayPoints.reduce((sum, point) => sum + point.price, 0) /
          dayPoints.length;

        return {
          ...latest,
          dateKey,
          recordedAt: new Date(dateKey),
          price,
        };
      })
      .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());
  }

  private standardDeviation(values: number[]) {
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance =
      values.reduce((sum, value) => sum + (value - avg) ** 2, 0) /
      values.length;

    return Math.sqrt(variance);
  }

  private startOfDay(date: Date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);

    return result;
  }

  private isAlertStatus(status: string): status is AlertStatus {
    return Object.values(AlertStatus).includes(status as AlertStatus);
  }
}
