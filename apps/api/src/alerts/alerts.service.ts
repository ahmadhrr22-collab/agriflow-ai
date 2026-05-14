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

  // ✅ NEW: digunakan oleh anomaly detection
  async createFromAnomaly(data: {
  type:        'PRICE_SPIKE' | 'PRICE_DROP' | 'SUPPLY_SHORTAGE' | 'DEMAND_SURGE' | 'ANOMALY_DETECTED';
  severity:    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title:       string;
  message:     string;
  commodityId: string;
  regionId:    string;
  metadata?:   any;
}) {
  return this.prisma.alert.create({
    data: {
      ...data,
      status: 'PENDING',
    },
  });
}

async seedDemoAlerts() {
  // Kosongkan — tidak perlu seed demo alerts lagi
  return;
}