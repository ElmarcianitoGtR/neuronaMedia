import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AndonAlert } from './andon-alert.entity.js';
import { TelemetryGateway } from './telemetry.gateway.js';
import { UdpService } from './udp.service.js';
import { TelemetrySimulatorService } from './telemetry-simulator.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ms-postgres', // container name
      port: 5432,
      username: 'ms_user',
      password: 'ms_password',
      database: 'ms_database',
      entities: [AndonAlert],
      synchronize: true, // auto-creates tables (only for development)
    }),
    TypeOrmModule.forFeature([AndonAlert]),
  ],
  controllers: [AppController],
  providers: [AppService, TelemetryGateway, UdpService, TelemetrySimulatorService],
})
export class AppModule {}
