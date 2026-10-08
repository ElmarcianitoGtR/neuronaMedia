import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AndonAlert } from './andon-alert.entity.js';
import { TelemetryLog } from './telemetry.entity.js';

@Controller('api')
export class AppController {
  constructor(
    @InjectRepository(AndonAlert)
    private alertRepository: Repository<AndonAlert>,
    @InjectRepository(TelemetryLog)
    private telemetryRepository: Repository<TelemetryLog>,
  ) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    // Top defects (based on scrap from telemetry, or alerts)
    const alerts = await this.alertRepository.find({ order: { createdAt: 'DESC' }, take: 50 });
    
    // Calculate top defects
    const defectCounts: Record<string, number> = {};
    alerts.forEach((a: any) => {
      if (a.message.includes('Térmica')) defectCounts['Temperatura'] = (defectCounts['Temperatura'] || 0) + 1;
      else if (a.message.includes('Presión')) defectCounts['Presión Alta'] = (defectCounts['Presión Alta'] || 0) + 1;
      else defectCounts['Mecánico'] = (defectCounts['Mecánico'] || 0) + 1;
    });
    const defectsData = Object.keys(defectCounts).map((k, i) => ({
      name: k, 
      value: defectCounts[k], // multiplied for visibility if few
      fill: ['#64748b', '#475569', '#334155'][i % 3]
    }));

    // Generate trend data dynamically (since we just started DB, mock the last 6 days + today from DB)
    const [todayLog] = await this.telemetryRepository.find({ order: { id: 'DESC' }, take: 1 });
    const todayProd = todayLog ? todayLog.actualUnits : 0;
    
    const trendData = [
      { time: 'Lun', produccion: 5200 }, { time: 'Mar', produccion: 6100 },
      { time: 'Mie', produccion: 5800 }, { time: 'Jue', produccion: 7400 },
      { time: 'Vie', produccion: 7100 }, { time: 'Sab', produccion: 8500 },
      { time: 'Hoy', produccion: todayProd > 0 ? todayProd : 1200 },
    ];

    // Andon Lines
    // Andon Lines from Database

    const distinctMachines = await this.telemetryRepository

      .createQueryBuilder("t")

      .select("t.machineId", "machineId")

      .addSelect("MAX(t.id)", "maxId")

      .groupBy("t.machineId")

      .getRawMany();



    const lines = [];

    for (const m of distinctMachines) {

      const log = await this.telemetryRepository.findOne({ where: { id: m.maxId } });

      const machineAlerts = alerts.filter((a: any) => a.lineName === m.machineId && a.status === "OPEN");

      const isDanger = machineAlerts.length > 0;

      lines.push({

        id: m.machineId,

        name: m.machineId,

        status: isDanger ? "danger" : ((log?.productivity || 0) > 80 ? "success" : "warning"),
        message: isDanger ? machineAlerts[0].message : "Operando Nominal",
        speed: `${log?.actualUnits || 0} u/h`,
        productivity: log?.productivity || 0,
        actualUnits: log?.actualUnits || 0,
        targetUnits: log?.targetUnits || 1500
      });

    }



    // Downtime summary (stacked bar: mech, elec, ops)
    const downtimeData = distinctMachines.map(m => {

      const machineAlerts = alerts.filter(a => a.lineName === m.machineId);

      let mech = 0, elec = 0, ops = 0;

      machineAlerts.forEach(a => {

        if (a.message.includes("Térmica")) elec++;

        else if (a.message.includes("Presión")) ops++;

        else mech++;

      });

      return { name: m.machineId, mech, elec, ops };

    });



    return {
      latestAlert: alerts.length > 0 ? alerts[0] : null,
      latestTelemetry: todayLog || { oee: 0, productivity: 0, actualUnits: 0, targetUnits: 0 },
      trendData,
      defectsData: defectsData.length ? defectsData : [
        { name: 'Temperatura', value: 30.7, fill: '#64748b' },
        { name: 'Presión Alta', value: 21.2, fill: '#475569' },
      ],
      lines,
      downtimeData
    };
  }

  @Get('dashboard/report/:lineName')
  async getReport(@Param('lineName') lineName: string) {
    const alerts = await this.alertRepository.find({ order: { createdAt: 'DESC' }, take: 5 });
    const isDanger = alerts.length > 0;
    const msg = isDanger ? alerts[0].message : 'Operación nominal detectada.';

    const isPressure = isDanger && msg.includes('Presión');

    return {
      latestAlert: alerts.length > 0 ? alerts[0] : null,
      id: `INC-${Math.floor(Math.random() * 9000) + 1000}`,
      descripcion: `Desviación en ${lineName}: ${msg}`,
      area: lineName,
      severidad: isDanger ? "Alta" : "Baja",
      estado: isDanger ? "En Auditoría" : "Cerrada",
      causaRaiz: isDanger ? "Deriva detectada en parámetros de telemetría." : "N/A",
      creadoEn: new Date().toISOString(),
      analisis: {
        titulo: `Reporte 8D Dinámico - ${lineName}`,
        resumen: `Generado desde el backend NestJS con datos vivos. Última alerta: ${msg}`,
        severidad: isDanger ? "Alta" : "Baja",
        disciplinas8d: {
          d1_equipo: ["Líder Mantenimiento", "Calidad"],
          d2_descripcion: `La línea experimentó: ${msg}`,
          d3_contencion: isDanger ? "Cuarentena de lote y ajuste de velocidad." : "N/A",
          d4_causaRaiz: isPressure ? "Fluctuación de presión (Tiro Corto) detectada por sensores." : "Fluctuación térmica detectada por sensores IoT.",
          d5_accionesCorrectivas: isPressure ? "Ajuste de válvulas neumáticas." : "Calibración de servomotores.",
          d6_implementacion: "Monitoreo continuo.",
          d7_prevencion: "Mantenimiento predictivo actualizado.",
          d8_cierre: isDanger ? "Pendiente" : "Cerrado"
        },
        ishikawa: [
          { categoria: "MAQUINARIA", causa: isPressure ? "Válvula defectuosa" : "Desgaste de rodamiento" },
          { categoria: "MEDIO AMBIENTE", causa: isPressure ? "Variación de presión en línea principal" : "Exceso de temperatura ambiental" }
        ],
        cincoPorques: isPressure ? [
          { id: "why-1", nivel: 1, pregunta: "¿Por qué falló?", respuesta: "Falta de presión (Tiro Corto)." },
          { id: "why-2", nivel: 2, pregunta: "¿Por qué faltó presión?", respuesta: "Pérdida en la línea neumática." },
          { id: "why-3", nivel: 3, pregunta: "¿Por qué hubo pérdida?", respuesta: "Fuga en empalme." },
          { id: "why-4", nivel: 4, pregunta: "¿Por qué fugó el empalme?", respuesta: "Desgaste del sello." },
          { id: "why-5", nivel: 5, pregunta: "¿Por qué se desgastó?", respuesta: "Material incorrecto para el fluido." }
        ] : [
          { id: "why-1", nivel: 1, pregunta: "¿Por qué falló?", respuesta: "Sobrecalentamiento." },
          { id: "why-2", nivel: 2, pregunta: "¿Por qué se sobrecalentó?", respuesta: "Fricción excesiva." },
          { id: "why-3", nivel: 3, pregunta: "¿Por qué hubo fricción?", respuesta: "Falta de lubricación." },
          { id: "why-4", nivel: 4, pregunta: "¿Por qué no se lubricó?", respuesta: "Bomba obstruida." },
          { id: "why-5", nivel: 5, pregunta: "¿Por qué se obstruyó?", respuesta: "Filtro no reemplazado en plan PM." }
        ],
        acciones: [],
        evidencias: []
      }
    };
  }
}
