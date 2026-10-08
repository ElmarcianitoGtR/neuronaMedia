import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AndonAlert } from './andon-alert.entity.js';
import { TelemetryGateway } from './telemetry.gateway.js';
import { ModbusService } from './modbus.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [AndonAlert],
      synchronize: true, // auto-creates tables (only for development)
    }),
    TypeOrmModule.forFeature([AndonAlert]),
  ],
  controllers: [AppController],
  providers: [AppService, TelemetryGateway, ModbusService],
})
export class AppModule {}
