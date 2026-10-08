import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { TelemetryGateway } from './telemetry.gateway.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AndonAlert } from './andon-alert.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class UdpService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UdpService.name);
  private server: dgram.Socket;
  private lastFalla: number = 0;

  constructor(
    private telemetryGateway: TelemetryGateway,
    @InjectRepository(AndonAlert)
    private alertRepository: Repository<AndonAlert>,
  ) {}

  onModuleInit() {
    this.server = dgram.createSocket('udp4');

    this.server.on('error', (err) => {
      this.logger.error(\`UDP Server error:\\n\${err.stack}\`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      // Expected payload: 9 uint16 elements = 18 bytes
      if (msg.length >= 18) {
        this.processNewData(msg);
      }
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      this.logger.log(\`UDP Server listening on \${address.address}:\${address.port}\`);
    });

    // Start listening on port 4000
    this.server.bind(4000, '0.0.0.0');
  }

  onModuleDestroy() {
    this.server.close();
  }

  async processNewData(msg: Buffer) {
    // MATLAB sends data in host byte order (typically Little-Endian on Windows/Intel)
    // Indexes (each element is 2 bytes):
    // 0: Máquina ID
    // 1: Etapa
    // 2: Falla
    // 3: Piezas OK
    // 4: Scrap
    // 5-6: Temp (Float32 cast to 2 uint16)
    // 7-8: Presión (Float32 cast to 2 uint16)

    try {
      const maquinaId = msg.readUInt16LE(0);
      const etapa = msg.readUInt16LE(2);
      const falla = msg.readUInt16LE(4);
      const piezasOk = msg.readUInt16LE(6);
      const scrap = msg.readUInt16LE(8);
      
      // Reconstruct IEEE 754 Float32 (Little Endian)
      const tempBuf = Buffer.alloc(4);
      tempBuf.writeUInt16LE(msg.readUInt16LE(10), 0);
      tempBuf.writeUInt16LE(msg.readUInt16LE(12), 2);
      const temp = tempBuf.readFloatLE(0);

      const presionBuf = Buffer.alloc(4);
      presionBuf.writeUInt16LE(msg.readUInt16LE(14), 0);
      presionBuf.writeUInt16LE(msg.readUInt16LE(16), 2);
      const presion = presionBuf.readFloatLE(0);

      const totalPiezas = piezasOk + scrap;
      const oee = totalPiezas > 0 ? (piezasOk / totalPiezas) * 100 : 0;
      
      const telemetry = {
        maquinaId: \`M-\${maquinaId.toString().padStart(2, '0')}\`,
        etapa,
        falla,
        piezasOk,
        scrap,
        temp: parseFloat(temp.toFixed(2)),
        presion: parseFloat(presion.toFixed(2)),
        oee: parseFloat(oee.toFixed(1)),
        targetUnits: 1500,
        actualUnits: piezasOk
      };

      // 1. Broadcast to Frontend via WebSockets
      this.telemetryGateway.broadcastTelemetry(telemetry);

      // 2. Log Alert to Database if there's a new fault
      if (falla !== 0 && falla !== this.lastFalla) {
        this.logger.warn(\`New Andon Alert detected! Machine: \${telemetry.maquinaId}, Fault Code: \${falla}\`);
        
        const newAlert = this.alertRepository.create({
          machineId: telemetry.maquinaId,
          faultCode: falla.toString(),
          faultDescription: falla === 1 ? 'Falla Térmica (Temperatura fuera de rango)' : 'Falla Presión (Tiro Corto)',
          temperatureAtFault: telemetry.temp,
          pressureAtFault: telemetry.presion,
          status: 'OPEN',
        });
        
        await this.alertRepository.save(newAlert);
      }
      this.lastFalla = falla;
    } catch (err) {
      this.logger.error(\`Error parsing UDP payload: \${err.message}\`);
    }
  }
}
