import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommoditiesModule } from './commodities/commodities.module';
import { RegionsModule } from './regions/regions.module';
import { PricesModule } from './prices/prices.module';
import { AlertsModule } from './alerts/alerts.module';
import { UsersService } from './users/users.service';
import { CommoditiesService } from './commodities/commodities.service';
import { RegionsService } from './regions/regions.service';
import { AlertsService } from './alerts/alerts.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    CommoditiesModule,
    RegionsModule,
    PricesModule,
    AlertsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private usersService:       UsersService,
    private commoditiesService: CommoditiesService,
    private regionsService:     RegionsService,
    private alertsService:      AlertsService,
  ) {}

  async onModuleInit() {
    await this.usersService.seedDemoUser();
    await this.commoditiesService.seed();
    await this.regionsService.seed();
  }
}