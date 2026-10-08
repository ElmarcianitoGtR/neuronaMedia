import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { TelemetryGateway } from './telemetry.gateway.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AndonAlert } from './andon-alert.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class TelemetrySimulatorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelemetrySimulatorService.name);
  private intervalId: NodeJS.Timeout;
  private lastFalla: number = 0;

  // Simulation state
  private etapa = 1;
  private piezasOk = 0;
  private scrap = 0;
  private baseTemp = 220;
  private basePressure = 120;
  private ciclo = 0;

  constructor(
    private telemetryGateway: TelemetryGateway,
    @InjectRepository(AndonAlert)
    private alertRepository: Repository<AndonAlert>,
  ) {}

  onModuleInit() {
    if (process.env.SIMULATE_TELEMETRY !== 'true') {
      this.logger.log('Telemetry simulator is disabled. (Set SIMULATE_TELEMETRY=true to enable)');
      return;
    }

    this.logger.warn('SIMULATE_TELEMETRY is TRUE. Generating mock MATLAB data internally...');
    
    this.intervalId = setInterval(() => this.simulateTick(), 2000);
  }

  onModuleDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private async simulateTick() {
    this.ciclo++;
    
    // Simular etapas (1 a 5)
    this.etapa = (this.etapa % 5) + 1;
    
    // Simular variaciones de temperatura (+- 2 grados)
    const temp = this.baseTemp + (Math.random() * 4 - 2);
    
    // Simular variaciones de presión (+- 5 bar)
    const presion = this.basePressure + (Math.random() * 10 - 5);

    // Simular piezas terminadas cuando la etapa vuelve a 1
    if (this.etapa === 1) {
      if (Math.random() > 0.1) this.piezasOk += 1;
      else this.scrap += 1;
    }

    // Simular inyección de fallas aleatorias (1 = Térmica, 2 = Presión, 0 = OK)
    let falla = 0;
    if (this.ciclo % 20 === 0) falla = Math.random() > 0.5 ? 1 : 2; 

    // Calculate basic OEE & Productivity
    const totalPiezas = this.piezasOk + this.scrap;
    const oee = totalPiezas > 0 ? (this.piezasOk / totalPiezas) * 100 : 0;
    
    const telemetry = {
      maquinaId: 'M-01',
      etapa: this.etapa,
      falla,
      piezasOk: this.piezasOk,
      scrap: this.scrap,
      temp: parseFloat(temp.toFixed(2)),
      presion: parseFloat(presion.toFixed(2)),
      oee: parseFloat(oee.toFixed(1)),
      targetUnits: 1500,
      actualUnits: this.piezasOk,
      productivity: parseFloat(((this.piezasOk / 1500) * 100).toFixed(1))
    };

    // 1. Broadcast to Frontend
    this.telemetryGateway.broadcastTelemetry(telemetry);

    // 2. Log Alert to Database if there's a new fault
    if (falla !== 0 && falla !== this.lastFalla) {
      this.logger.warn(`[SIMULATOR] New Andon Alert detected! Machine: ${telemetry.maquinaId}, Fault Code: ${falla}`);
      
      const newAlert = this.alertRepository.create({
        lineName: telemetry.maquinaId,
        status: 'OPEN',
        message: falla === 1
          ? `Falla Térmica (Temperatura ${telemetry.temp}°C fuera de rango)`
          : `Falla Presión (Tiro Corto a ${telemetry.presion} bar)`,
      });
      
      await this.alertRepository.save(newAlert);
    }
    this.lastFalla = falla;
  }
}
