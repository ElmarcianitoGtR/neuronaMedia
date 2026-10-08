import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { TelemetryGateway } from './telemetry.gateway.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AndonAlert } from './andon-alert.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ModbusService implements OnModuleInit {
  private readonly logger = new Logger(ModbusService.name);
  private serverTCP: any;
  private holdingRegisters: Buffer;
  
  // Track last fault to avoid spamming DB
  private lastFalla: number = 0;

  constructor(
    private telemetryGateway: TelemetryGateway,
    @InjectRepository(AndonAlert)
    private alertRepository: Repository<AndonAlert>,
  ) {
    // 100 registers of 16 bits (2 bytes each) = 200 bytes
    this.holdingRegisters = Buffer.alloc(200); 
  }

  onModuleInit() {
    const vector = {
      getHoldingRegister: (addr: number, unitID: number, callback: Function) => {
        const val = this.holdingRegisters.readUInt16BE(addr * 2);
        callback(null, val);
      },
      setRegister: (addr: number, value: number, unitID: number, callback: Function) => {
        this.holdingRegisters.writeUInt16BE(value, addr * 2);
        
        // When the last parameter (Presion Low at offset 8) is updated, broadcast
        if (addr === 8) {
           this.processNewData();
        }
        
        callback(null);
      }
    };

    // We start the server on port 5020. 
    this.serverTCP = new ModbusRTU.ServerTCP(vector, { host: '0.0.0.0', port: 5020, debug: false, unitID: 1 });
    this.logger.log('Modbus TCP Server listening on port 5020');
  }

  async processNewData() {
    // From PROTOCOLO_MODBUS.md:
    // 40001 (Offset 0): Máquina ID (uint16)
    // 40002 (Offset 1): Etapa (uint16)
    // 40003 (Offset 2): Falla (uint16)
    // 40004 (Offset 3): Piezas OK (uint16)
    // 40005 (Offset 4): Scrap (uint16)
    // 40006-40007 (Offset 5-6): Temp (float32)
    // 40008-40009 (Offset 7-8): Presión (float32)

    const maquinaId = this.holdingRegisters.readUInt16BE(0 * 2);
    const etapa = this.holdingRegisters.readUInt16BE(1 * 2);
    const falla = this.holdingRegisters.readUInt16BE(2 * 2);
    const piezasOk = this.holdingRegisters.readUInt16BE(3 * 2);
    const scrap = this.holdingRegisters.readUInt16BE(4 * 2);
    
    // IEEE 754 Float32 (Big Endian)
    const temp = this.holdingRegisters.readFloatBE(5 * 2);
    const presion = this.holdingRegisters.readFloatBE(7 * 2);

    // Calculate basic OEE & Productivity
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
      targetUnits: 1500, // Hardcoded target for now
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
  }
}
