import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.alert.findMany({
      where,
      include: {
        commodity: { select: { id: true, localName: true } },
        region:    { select: { id: true, name: true, province: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data:  { status: 'READ', readAt: new Date() },
    });
  }

  async dismiss(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data:  { status: 'DISMISSED' },
    });
  }

  async getUnreadCount() {
    return this.prisma.alert.count({
      where: { status: { in: ['PENDING', 'SENT'] } },
    });
  }

  async seedDemoAlerts() {
    const existing = await this.prisma.alert.count();
    if (existing > 0) return;

    const commodity = await this.prisma.commodity.findFirst({
      where: { name: 'cabai-merah' },
    });
    const region = await this.prisma.region.findFirst({
      where: { name: 'Jakarta Timur' },
    });

    if (!commodity || !region) return;

    const alerts = [
      {
        type:        'PRICE_SPIKE' as const,
        severity:    'CRITICAL' as const,
        title:       'Lonjakan harga cabai merah terdeteksi',
        message:     'Harga cabai merah di Kramat Jati naik 22% dalam 3 hari terakhir. Z-score: 3.2. Kemungkinan bottleneck distribusi di jalur Pantura.',
        commodityId: commodity.id,
        regionId:    region.id,
        status:      'SENT' as const,
        metadata:    { pct_change: 22, z_score: 3.2, days: 3 },
      },
      {
        type:        'DEMAND_SURGE' as const,
        severity:    'HIGH' as const,
        title:       'Potensi shortage di Jakarta Timur',
        message:     'Estimasi defisit 340 ton cabai merah minggu depan berdasarkan tren demand dan supply saat ini.',
        commodityId: commodity.id,
        regionId:    region.id,
        status:      'SENT' as const,
        metadata:    { deficit_ton: 340, week: 'next' },
      },
      {
        type:        'PRICE_SPIKE' as const,
        severity:    'MEDIUM' as const,
        title:       'Harga di atas baseline — Bekasi',
        message:     'Harga cabai merah di Bekasi 18% di atas rata-rata historis minggu yang sama. Perlu pemantauan lebih lanjut.',
        commodityId: commodity.id,
        regionId:    region.id,
        status:      'SENT' as const,
        metadata:    { deviation_pct: 18 },
      },
      {
        type:        'ANOMALY_DETECTED' as const,
        severity:    'LOW' as const,
        title:       'Pola distribusi tidak normal terdeteksi',
        message:     'Isolation Forest mendeteksi pola harga tidak normal di Garut selama 2 hari terakhir. Kemungkinan disebabkan oleh faktor cuaca.',
        commodityId: commodity.id,
        regionId:    region.id,
        status:      'PENDING' as const,
        metadata:    { model: 'isolation_forest', days: 2 },
      },
    ];

    for (const alert of alerts) {
      await this.prisma.alert.create({ data: alert });
    }

    console.log('✅ Demo alerts seeded');
  }
}