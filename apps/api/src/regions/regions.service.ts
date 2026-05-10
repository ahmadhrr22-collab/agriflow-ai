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
      { name: 'Aceh',                      province: 'Aceh',                      latitude:  4.6951,  longitude:  96.7494 },
      { name: 'Sumatera Utara',             province: 'Sumatera Utara',            latitude:  2.1154,  longitude:  99.5451 },
      { name: 'Sumatera Barat',             province: 'Sumatera Barat',            latitude: -0.7399,  longitude: 100.8000 },
      { name: 'Riau',                       province: 'Riau',                      latitude:  0.2933,  longitude: 101.7068 },
      { name: 'Kepulauan Riau',             province: 'Kepulauan Riau',            latitude:  3.9457,  longitude: 108.1429 },
      { name: 'Jambi',                      province: 'Jambi',                     latitude: -1.6101,  longitude: 103.6131 },
      { name: 'Bengkulu',                   province: 'Bengkulu',                  latitude: -3.7928,  longitude: 102.2608 },
      { name: 'Sumatera Selatan',           province: 'Sumatera Selatan',          latitude: -3.3194,  longitude: 103.9144 },
      { name: 'Kepulauan Bangka Belitung',  province: 'Kepulauan Bangka Belitung', latitude: -2.7411,  longitude: 106.4406 },
      { name: 'Lampung',                    province: 'Lampung',                   latitude: -4.5586,  longitude: 105.4068 },
      { name: 'Banten',                     province: 'Banten',                    latitude: -6.4058,  longitude: 106.0640 },
      { name: 'Jawa Barat',                 province: 'Jawa Barat',                latitude: -6.9175,  longitude: 107.6191 },
      { name: 'DKI Jakarta',                province: 'DKI Jakarta',               latitude: -6.2088,  longitude: 106.8456 },
      { name: 'Jawa Tengah',                province: 'Jawa Tengah',               latitude: -7.1500,  longitude: 110.1403 },
      { name: 'DI Yogyakarta',              province: 'DI Yogyakarta',             latitude: -7.7956,  longitude: 110.3695 },
      { name: 'Jawa Timur',                 province: 'Jawa Timur',                latitude: -7.5361,  longitude: 112.2384 },
      { name: 'Bali',                       province: 'Bali',                      latitude: -8.4095,  longitude: 115.1889 },
      { name: 'Nusa Tenggara Barat',        province: 'Nusa Tenggara Barat',       latitude: -8.6529,  longitude: 117.3616 },
      { name: 'Nusa Tenggara Timur',        province: 'Nusa Tenggara Timur',       latitude: -8.6574,  longitude: 121.0794 },
      { name: 'Kalimantan Barat',           province: 'Kalimantan Barat',          latitude:  0.0000,  longitude: 109.0000 },
      { name: 'Kalimantan Selatan',         province: 'Kalimantan Selatan',        latitude: -3.0926,  longitude: 115.2838 },
      { name: 'Kalimantan Tengah',          province: 'Kalimantan Tengah',         latitude: -1.6815,  longitude: 113.3824 },
      { name: 'Kalimantan Timur',           province: 'Kalimantan Timur',          latitude:  1.6407,  longitude: 116.4194 },
      { name: 'Kalimantan Utara',           province: 'Kalimantan Utara',          latitude:  3.0731,  longitude: 116.0413 },
      { name: 'Gorontalo',                  province: 'Gorontalo',                 latitude:  0.6999,  longitude: 122.4467 },
      { name: 'Sulawesi Selatan',           province: 'Sulawesi Selatan',          latitude: -3.6687,  longitude: 119.9740 },
      { name: 'Sulawesi Tenggara',          province: 'Sulawesi Tenggara',         latitude: -4.1449,  longitude: 122.1746 },
      { name: 'Sulawesi Tengah',            province: 'Sulawesi Tengah',           latitude: -1.4300,  longitude: 121.4456 },
      { name: 'Sulawesi Utara',             province: 'Sulawesi Utara',            latitude:  0.6247,  longitude: 123.9750 },
      { name: 'Sulawesi Barat',             province: 'Sulawesi Barat',            latitude: -2.8441,  longitude: 119.2320 },
      { name: 'Maluku',                     province: 'Maluku',                    latitude: -3.2385,  longitude: 130.1453 },
      { name: 'Maluku Utara',               province: 'Maluku Utara',              latitude:  1.5709,  longitude: 127.8088 },
      { name: 'Papua',                      province: 'Papua',                     latitude: -4.2699,  longitude: 138.0804 },
      { name: 'Papua Barat',                province: 'Papua Barat',               latitude: -1.3361,  longitude: 133.1747 },
    ];

    for (const r of regions) {
      await this.prisma.region.upsert({
        where:  { name_province: { name: r.name, province: r.province } },
        update: { latitude: r.latitude, longitude: r.longitude },
        create: { ...r, type: 'province', isActive: true },
      });
    }
    console.log('✅ Regions seeded (34 provinsi)');
  }
}