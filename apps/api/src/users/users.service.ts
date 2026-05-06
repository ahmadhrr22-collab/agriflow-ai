import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async seedDemoUser() {
    const existing = await this.findByEmail('analyst@agriflow.ai');
    if (existing) return;

    await this.prisma.user.create({
      data: {
        name: 'Analyst Demo',
        email: 'analyst@agriflow.ai',
        password: await bcrypt.hash('password123', 10),
        role: 'ANALYST',
      },
    });
    console.log('✅ Demo user seeded');
  }
}