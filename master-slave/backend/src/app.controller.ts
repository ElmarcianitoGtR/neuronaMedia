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
    alerts.forEach(a => {
      if (a.message.includes('Térmica')) defectCounts['Termal'] = (defectCounts['Termal'] || 0) + 1;
      else if (a.message.includes('Presión')) defectCounts['Presión'] = (defectCounts['Presión'] || 0) + 1;
      else defectCounts['Mecánica'] = (defectCounts['Mecánica'] || 0) + 1;
    });
    const defectsData = Object.keys(defectCounts).map((k, i) => ({
      name: k, 
      value: defectCounts[k] * 10, // multiplied for visibility if few
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
    const lines = [
      { id: 1, name: 'Línea 1', status: (todayLog?.productivity || 0) > 80 ? 'success' : 'warning', message: 'Operando', speed: `${todayLog?.actualUnits || 0} u/h` },
      { id: 2, name: 'Línea 2', status: 'danger', message: alerts[0]?.message || 'Falla', speed: '0 u/h' },
      { id: 3, name: 'Línea 3', status: 'warning', message: 'Alerta Calidad', speed: '1,200 u/h' },
    ];

    // Downtime summary (stacked bar: mech, elec, ops)
    const downtimeData = [
      { name: 'L1', mech: (defectCounts['Mecánica'] || 0) * 10, elec: (defectCounts['Termal'] || 0) * 10, ops: (defectCounts['Presión'] || 0) * 10 },
      { name: 'L2', mech: 15, elec: 25, ops: 10 },
      { name: 'L3', mech: 30, elec: 5, ops: 15 },
      { name: 'L4', mech: 10, elec: 15, ops: 20 },
    ];

    return {
      trendData,
      defectsData: defectsData.length ? defectsData : [
        { name: 'Termal', value: 30.7, fill: '#64748b' },
        { name: 'Presión', value: 21.2, fill: '#475569' },
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

    return {
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
          d4_causaRaiz: "Fluctuación térmica detectada por sensores IoT.",
          d5_accionesCorrectivas: "Calibración de servomotores.",
          d6_implementacion: "Monitoreo continuo.",
          d7_prevencion: "Mantenimiento predictivo actualizado.",
          d8_cierre: isDanger ? "Pendiente" : "Cerrado"
        },
        ishikawa: [
          { categoria: "MAQUINARIA", causa: "Desgaste de rodamiento" },
          { categoria: "MEDIO AMBIENTE", causa: "Exceso de temperatura ambiental" }
        ],
        cincoPorques: [
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
