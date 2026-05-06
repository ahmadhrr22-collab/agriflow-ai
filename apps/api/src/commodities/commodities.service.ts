import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommoditiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.commodity.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.commodity.findUnique({ where: { id } });
  }

  async seed() {
    const commodities = [
      {
        name: 'cabai-merah',
        localName: 'Cabai Merah',
        unit: 'kg',
        category: 'Sayuran',
      },
      {
        name: 'bawang-merah',
        localName: 'Bawang Merah',
        unit: 'kg',
        category: 'Sayuran',
      },
      {
        name: 'beras-medium',
        localName: 'Beras Medium',
        unit: 'kg',
        category: 'Beras',
      },
    ];

    for (const c of commodities) {
      await this.prisma.commodity.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      });
    }
    console.log('✅ Commodities seeded');
  }
}