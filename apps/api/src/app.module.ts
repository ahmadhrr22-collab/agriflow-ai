import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { CommoditiesModule } from './commodities/commodities.module';
import { RegionsModule } from './regions/regions.module';
import { PricesModule } from './prices/prices.module';
import { AnomaliesModule } from './anomalies/anomalies.module';
import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Config global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Scheduler global (untuk cron jobs nanti)
    ScheduleModule.forRoot(),

    // Database
    PrismaModule,

    CommoditiesModule,

    RegionsModule,

    PricesModule,

    AnomaliesModule,

    AlertsModule,

    AuthModule,

    UsersModule,
  ],
})
export class AppModule {}