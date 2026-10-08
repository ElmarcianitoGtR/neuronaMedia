import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { TelemetryGateway } from './telemetry.gateway.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AndonAlert } from './andon-alert.entity.js';
import { TelemetryLog } from './telemetry.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class UdpService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UdpService.name);
  private server: dgram.Socket;
  private lastFalla: Record<string, number> = {};
  private lastSavedUnits: Record<string, number> = {};


  async sendTelegramAlert(message: string) {
    const BOT_TOKEN = '8901927878:AAEMJDt4QNO9hLvJKNmLqb1eL3gOrUIoj0U';
    const CHAT_ID = '8304747615';

    const url = \https://api.telegram.org/bot\/sendMessage\;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
      });
      this.logger.log(\Alerta de Telegram enviada exitosamente.\);
    } catch (error) {
      this.logger.error(\Error enviando alerta de Telegram: \\);
    }
  }

  constructor(
    private telemetryGateway: TelemetryGateway,
    @InjectRepository(AndonAlert)
    private alertRepository: Repository<AndonAlert>,
    @InjectRepository(TelemetryLog)
    private telemetryRepository: Repository<TelemetryLog>,
  ) { }

  onModuleInit() {
    this.server = dgram.createSocket('udp4');

    this.server.on('error', (err) => {
      this.logger.error(\UDP Server error:\\n\\);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      if (process.env.DEBUG_UDP === 'true') {
        this.logger.log(\UDP Msg from \:\ - Size: \ bytes\);
      }
      if (msg.length >= 18) {
        this.processNewData(msg);
      } else if (process.env.DEBUG_UDP === 'true') {
        this.logger.warn(\Ignored packet: Expected 18 bytes, got \\);
      }
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      this.logger.log(\UDP Server listening on \:\\);
    });

    this.server.bind(4000, '0.0.0.0');
  }

  onModuleDestroy() {
    if (this.server) {
      this.server.close();
    }
  }

  async processNewData(msg: Buffer) {
    try {
      const maquinaId = msg.readUInt16LE(0);
      const etapa = msg.readUInt16LE(2);
      const falla = msg.readUInt16LE(4);
      const piezasOk = msg.readUInt16LE(6);
      const scrap = msg.readUInt16LE(8);

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

      const targetUnits = 1500;
      const productivity = parseFloat(((piezasOk / targetUnits) * 100).toFixed(1));

      const telemetry = {
        maquinaId: \M-\\,
        etapa,
        falla,
        piezasOk,
        scrap,
        temp: parseFloat(temp.toFixed(2)),
        presion: parseFloat(presion.toFixed(2)),
        oee: parseFloat(oee.toFixed(1)),
        productivity,
        targetUnits,
        actualUnits: piezasOk
      };

      this.telemetryGateway.broadcastTelemetry(telemetry);

      const lastUnits = this.lastSavedUnits[telemetry.maquinaId] || -1;
      if (telemetry.actualUnits > lastUnits) {
        const newLog = this.telemetryRepository.create({
          machineId: telemetry.maquinaId,
          oee: telemetry.oee,
          productivity: telemetry.productivity,
          actualUnits: telemetry.actualUnits,
          targetUnits: telemetry.targetUnits,
          temp: telemetry.temp,
          presion: telemetry.presion,
          defects: telemetry.scrap
        });
        await this.telemetryRepository.save(newLog);
        this.lastSavedUnits[telemetry.maquinaId] = telemetry.actualUnits;
      }

      if (falla !== 0 && falla !== this.lastFalla[telemetry.maquinaId]) {
        this.logger.warn(\New Andon Alert detected! Machine: \, Fault Code: \\);

        const newAlert = this.alertRepository.create({
          lineName: telemetry.maquinaId,
          status: 'OPEN',
          message: \Código \: \ (Temp: \°C, Presión: \ bar)\,
        });

        const savedAlert = await this.alertRepository.save(newAlert);
        this.telemetryGateway.broadcastAnomaly(savedAlert);

        // Enviar alerta por Telegram
        const telegramMsg = \🚨 ALERTA ANDON [\]\\nCódigo de falla: \\\nMotivo: \\\nTemp: \°C | Presión: \ bar\;
        this.sendTelegramAlert(telegramMsg);
      }
      this.lastFalla[telemetry.maquinaId] = falla;
    } catch (err: any) {
      this.logger.error(\Error parsing UDP payload: \\);
    }
  }
}
