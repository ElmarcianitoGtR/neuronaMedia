import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AndonAlert } from './andon-alert.entity.js';
import { TelemetryLog } from './telemetry.entity.js';
import { TelemetryGateway } from './telemetry.gateway.js';
import { UdpService } from './udp.service.js';
import { TelemetrySimulatorService } from './telemetry-simulator.service.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [AndonAlert, TelemetryLog],
      synchronize: process.env.NODE_ENV !== 'production', // Unsafe for production!
    }),
    TypeOrmModule.forFeature([AndonAlert, TelemetryLog]),
  ],
  controllers: [AppController],
  providers: [AppService, TelemetryGateway, UdpService, TelemetrySimulatorService],
})
export class AppModule {}
