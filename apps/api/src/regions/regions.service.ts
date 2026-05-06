import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.region.findMany({
      where: { isActive: true },
      orderBy: { province: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.region.findUnique({ where: { id } });
  }

  async findByProvince(province: string) {
    return this.prisma.region.findMany({
      where: { province, isActive: true },
    });
  }

  async seed() {
    const regions = [
      { name: 'Jakarta Pusat',  province: 'DKI Jakarta',   type: 'city', latitude: -6.1744,  longitude: 106.8294 },
      { name: 'Jakarta Timur',  province: 'DKI Jakarta',   type: 'city', latitude: -6.2250,  longitude: 106.9004 },
      { name: 'Jakarta Barat',  province: 'DKI Jakarta',   type: 'city', latitude: -6.1674,  longitude: 106.7637 },
      { name: 'Jakarta Selatan',province: 'DKI Jakarta',   type: 'city', latitude: -6.2615,  longitude: 106.8106 },
      { name: 'Bandung',        province: 'Jawa Barat',    type: 'city', latitude: -6.9175,  longitude: 107.6191 },
      { name: 'Garut',          province: 'Jawa Barat',    type: 'city', latitude: -7.2167,  longitude: 107.9000 },
      { name: 'Majalengka',     province: 'Jawa Barat',    type: 'city', latitude: -6.8364,  longitude: 108.2274 },
      { name: 'Brebes',         province: 'Jawa Tengah',   type: 'city', latitude: -6.8722,  longitude: 109.0394 },
      { name: 'Bogor',          province: 'Jawa Barat',    type: 'city', latitude: -6.5971,  longitude: 106.8060 },
      { name: 'Bekasi',         province: 'Jawa Barat',    type: 'city', latitude: -6.2383,  longitude: 106.9756 },
    ];

    for (const r of regions) {
      await this.prisma.region.upsert({
        where: { name_province: { name: r.name, province: r.province } },
        update: {},
        create: r,
      });
    }
    console.log('✅ Regions seeded');
  }
}