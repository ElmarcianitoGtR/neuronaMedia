import neo4j, { type Driver, type Session } from 'neo4j-driver';
import type {
  Incidencia,
  AnalisisCalidad,
  IshikawaFactor,
  CausaPorQue,
  Accion,
  Evidencia
} from '../types';

let driverInstance: Driver | null = null;
let isConnected = false;

// Memoria de respaldo local por si el contenedor de Memgraph no está iniciado
const memoryStore = new Map<string, Incidencia>();

// Semilla inicial representativa para demostración y auditoría
const demoIncidente: Incidencia = {
  id: 'INC-2026-001',
  descripcion: 'Defecto de torque en tornillo de sujeción de pinza de freno delantero',
  area: 'Línea de Ensamble de Chasis (Estación 04)',
  severidad: 'Crítica',
  estado: 'En Auditoría',
  causaRaiz: 'Falta de sincronización entre el odómetro de ciclos de la atornilladora y el plan de calibración',
  creadoEn: new Date().toISOString(),
  analisis: {
    titulo: 'Desviación Crítica de Torque en Ensamble de Frenos',
    resumen: 'Durante la auditoría de calidad al final de línea se detectaron 3 unidades con torque inferior a 85 Nm (especificación 110±5 Nm).',
    severidad: 'Crítica',
    disciplinas8d: {
      d1_equipo: ['Ing. Carlos Méndez (Líder Calidad)', 'Laura Torres (Ing. Procesos)', 'Roberto Ruiz (Mantenimiento)'],
      d2_descripcion: '3 vehículos presentaron torque de 78 Nm en pernos M12 de cáliper en estación 04 del turno vespertino.',
      d3_contencion: 'Paro técnico de estación 04. Cuarentena de 42 unidades producidas en el turno para reapriete manual con torquímetro calibrado.',
      d4_causaRaiz: 'El transductor del servocontrolador de la atornilladora automática acumuló deriva térmica por falla del ventilador auxiliar.',
      d5_accionesCorrectivas: 'Sustitución inmediata del transductor y ventilador. Validación con celda de carga patrón.',
      d6_implementacion: 'Instalación de sensor térmico con enclavamiento al PLC que bloquea el ciclo si la temperatura supera 45°C.',
      d7_prevencion: 'Incorporación de verificación de temperatura en checklist diario y calibración semanal con torquímetro digital.',
      d8_cierre: 'Lote liberado al 100% con doble firma. Felicitaciones al equipo de auditoría por detección temprana.'
    },
    ishikawa: [
      {
        id: 'ish-demo-1',
        categoria: 'Maquinaria',
        factor: 'Deriva en Servocontrolador',
        descripcion: 'Transductor afectado por calentamiento de la herramienta neumática/eléctrica.',
        impacto: 'Alto',
        esCausaRaiz: true
      },
      {
        id: 'ish-demo-2',
        categoria: 'Método',
        factor: 'Procedimiento de Verificación',
        descripcion: 'La verificación con torquímetro manual se hacía cada 100 ciclos en lugar de cada 25.',
        impacto: 'Medio',
        esCausaRaiz: false
      },
      {
        id: 'ish-demo-3',
        categoria: 'Mano de Obra',
        factor: 'Rotación de Personal',
        descripcion: 'Operador relevo no notificó alerta visual preventiva en pantalla HMI.',
        impacto: 'Bajo',
        esCausaRaiz: false
      },
      {
        id: 'ish-demo-4',
        categoria: 'Materiales',
        factor: 'Lote de Tornillos M12',
        descripcion: 'Inspección de rosca y acabado superficial aprobados conforme a norma JIS.',
        impacto: 'Bajo',
        esCausaRaiz: false
      },
      {
        id: 'ish-demo-5',
        categoria: 'Medición',
        factor: 'Tolerancia del Transductor',
        descripcion: 'Falta de verificación metrológica diaria en la línea de montaje.',
        impacto: 'Medio',
        esCausaRaiz: false
      },
      {
        id: 'ish-demo-6',
        categoria: 'Medio Ambiente',
        factor: 'Temperatura en Estación',
        descripcion: 'Calor ambiental elevado en celda de montaje durante horas pico.',
        impacto: 'Medio',
        esCausaRaiz: false
      }
    ],
    cincoPorques: [
      {
        id: 'why-demo-1',
        nivel: 1,
        pregunta: '¿Por qué el tornillo de cáliper no alcanzó el torque especificado?',
        respuesta: 'Porque la herramienta automática se detuvo antes de alcanzar los 110 Nm programados.'
      },
      {
        id: 'why-demo-2',
        nivel: 2,
        pregunta: '¿Por qué la herramienta se detuvo prematuramente?',
        respuesta: 'Porque el transductor interno reportó erróneamente que ya se había alcanzado el par objetivo.'
      },
      {
        id: 'why-demo-3',
        nivel: 3,
        pregunta: '¿Por qué el transductor reportó una lectura errónea?',
        respuesta: 'Porque sufrió una deriva de medición severa por sobrecalentamiento interno del motor.'
      },
      {
        id: 'why-demo-4',
        nivel: 4,
        pregunta: '¿Por qué se sobrecalentó el motor de la herramienta?',
        respuesta: 'Porque el microventilador de refrigeración del husillo estaba atascado con pelusa industrial.'
      },
      {
        id: 'why-demo-5',
        nivel: 5,
        pregunta: '¿Por qué el ventilador estaba atascado sin haberse detectado? (Causa Raíz)',
        respuesta: 'Porque no existía un sensor de flujo de aire ni una rutina de limpieza periódica para la carcasa de la atornilladora.'
      }
    ],
    acciones: [
      {
        id: 'act-demo-1',
        disciplina: 'D3',
        tipo: 'Contención',
        descripcion: 'Segregación y verificación de 42 chasis con torquímetro manual calibrado.',
        responsable: 'Supervisor de Calidad',
        estado: 'Completada'
      },
      {
        id: 'act-demo-2',
        disciplina: 'D5',
        tipo: 'Correctiva',
        descripcion: 'Reemplazo de transductor dañado y limpieza ultrasónica del sistema de enfriamiento.',
        responsable: 'Mantenimiento Electrónico',
        estado: 'En Proceso'
      },
      {
        id: 'act-demo-3',
        disciplina: 'D7',
        tipo: 'Preventiva',
        descripcion: 'Instalación de sensor de flujo térmico con alarma enclavada al PLC de línea.',
        responsable: 'Ingeniería de Automatización',
        estado: 'Pendiente'
      }
    ],
    evidencias: [
      {
        id: 'evi-demo-1',
        tipo: 'Lectura de Torque',
        descripcion: 'Perno Cáliper Delantero Izquierdo',
        valor: '78.2 Nm (Mínimo requerido: 105 Nm)',
        url: ''
      },
      {
        id: 'evi-demo-2',
        tipo: 'Telemetría PLC',
        descripcion: 'Temperatura de carcasa atornilladora',
        valor: '62.4 °C (Umbral máximo: 45 °C)',
        url: ''
      }
    ]
  }
};
memoryStore.set(demoIncidente.id, demoIncidente);

export function getDriver(): Driver | null {
  if (driverInstance) return driverInstance;

  const uri = process.env.GRAPH_DB_URI;
  const user = process.env.GRAPH_DB_USER || '';
  const password = process.env.GRAPH_DB_PASSWORD || '';

  try {
    const auth = user ? neo4j.auth.basic(user, password) : neo4j.auth.none();
    driverInstance = neo4j.driver(uri, auth, {
      maxConnectionLifetime: 3 * 60 * 60 * 1000,
      maxConnectionPoolSize: 50,
      connectionTimeout: 2000
    });
    return driverInstance;
  } catch (err: any) {
    console.warn(`[Memgraph] No se pudo inicializar neo4j-driver (${uri}):`, err?.message || err);
    return null;
  }
}

async function runCypherSafe<T = any>(
  query: string,
  params: Record<string, any> = {}
): Promise<T[] | null> {
  const driver = getDriver();
  if (!driver) return null;

  let session: Session | null = null;
  try {
    session = driver.session();
    const result = await session.run(query, params);
    isConnected = true;
    return result.records.map((r) => r.toObject() as T);
  } catch (error: any) {
    console.warn('[Memgraph] Fallo al ejecutar consulta Cypher en Memgraph:', error?.message || error);
    isConnected = false;
    return null;
  } finally {
    if (session) {
      await session.close().catch(() => {});
    }
  }
}

/**
 * Guarda una nueva incidencia y todo su subgrafo estructurado en Memgraph mediante Cypher parametrizado
 */
export async function saveToMemgraph(
  analisis: AnalisisCalidad,
  extra: { id?: string; area?: string; descripcionOriginal?: string } = {}
): Promise<string> {
  const incidenciaId = extra.id || `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const area = extra.area || 'Línea de Producción';
  const descripcion = extra.descripcionOriginal || analisis.resumen || analisis.titulo;
  const severidad = analisis.severidad || 'Media';
  const causaRaiz = analisis.disciplinas8d?.d4_causaRaiz || analisis.cincoPorques?.[4]?.respuesta || 'Por determinar';
  const ahora = new Date().toISOString();

  const nuevaIncidencia: Incidencia = {
    id: incidenciaId,
    descripcion,
    area,
    severidad,
    estado: 'En Auditoría',
    causaRaiz,
    creadoEn: ahora,
    actualizadoEn: ahora,
    analisis
  };

  // Guardar siempre en memoria local como resguardo
  memoryStore.set(incidenciaId, nuevaIncidencia);

  // Intentar persistir en Memgraph usando Cypher parametrizado
  try {
    // 1. Crear nodo Incidencia
    const cypherIncidencia = `
      MERGE (i:Incidencia { id: $id })
      SET i.descripcion = $descripcion,
          i.area = $area,
          i.severidad = $severidad,
          i.estado = $estado,
          i.causaRaiz = $causaRaiz,
          i.creadoEn = $creadoEn,
          i.actualizadoEn = $actualizadoEn,
          i.titulo = $titulo,
          i.resumen = $resumen,
          i.d1_equipo = $d1_equipo,
          i.d2_descripcion = $d2_descripcion,
          i.d3_contencion = $d3_contencion,
          i.d4_causaRaiz = $d4_causaRaiz,
          i.d5_accionesCorrectivas = $d5_accionesCorrectivas,
          i.d6_implementacion = $d6_implementacion,
          i.d7_prevencion = $d7_prevencion,
          i.d8_cierre = $d8_cierre
      RETURN i.id AS id
    `;

    await runCypherSafe(cypherIncidencia, {
      id: incidenciaId,
      descripcion,
      area,
      severidad,
      estado: 'En Auditoría',
      causaRaiz,
      creadoEn: ahora,
      actualizadoEn: ahora,
      titulo: analisis.titulo,
      resumen: analisis.resumen,
      d1_equipo: analisis.disciplinas8d.d1_equipo,
      d2_descripcion: analisis.disciplinas8d.d2_descripcion,
      d3_contencion: analisis.disciplinas8d.d3_contencion,
      d4_causaRaiz: analisis.disciplinas8d.d4_causaRaiz,
      d5_accionesCorrectivas: analisis.disciplinas8d.d5_accionesCorrectivas,
      d6_implementacion: analisis.disciplinas8d.d6_implementacion,
      d7_prevencion: analisis.disciplinas8d.d7_prevencion,
      d8_cierre: analisis.disciplinas8d.d8_cierre
    });

    // 2. Crear Evidencias y relación (:Incidencia)-[:RESPALDADA_POR]->(:Evidencia)
    for (const evi of analisis.evidencias || []) {
      const cypherEvidencia = `
        MATCH (i:Incidencia { id: $incidenciaId })
        MERGE (e:Evidencia { id: $id })
        SET e.tipo = $tipo,
            e.descripcion = $descripcion,
            e.valor = $valor,
            e.url = $url
        MERGE (i)-[:RESPALDADA_POR]->(e)
      `;
      await runCypherSafe(cypherEvidencia, {
        incidenciaId,
        id: evi.id,
        tipo: evi.tipo,
        descripcion: evi.descripcion,
        valor: evi.valor || '',
        url: evi.url || ''
      });
    }

    // 3. Crear IshikawaFactor y relación (:Incidencia)-[:EVALUADA_EN]->(:IshikawaFactor)
    for (const ish of analisis.ishikawa || []) {
      const cypherIshikawa = `
        MATCH (i:Incidencia { id: $incidenciaId })
        MERGE (f:IshikawaFactor { id: $id })
        SET f.categoria = $categoria,
            f.factor = $factor,
            f.descripcion = $descripcion,
            f.impacto = $impacto,
            f.esCausaRaiz = $esCausaRaiz
        MERGE (i)-[:EVALUADA_EN]->(f)
      `;
      await runCypherSafe(cypherIshikawa, {
        incidenciaId,
        id: ish.id,
        categoria: ish.categoria,
        factor: ish.factor,
        descripcion: ish.descripcion,
        impacto: ish.impacto,
        esCausaRaiz: Boolean(ish.esCausaRaiz)
      });
    }

    // 4. Crear CausaPorQue (5 Porqués) y relaciones
    // (:Incidencia)-[:CAUSADO_POR]->(w1) y (w1)-[:CONDUCE_A]->(w2)...
    let prevWhyId: string | null = null;
    const sortedWhys = [...analisis.cincoPorques].sort((a, b) => a.nivel - b.nivel);

    for (const why of sortedWhys) {
      const cypherWhy = `
        MATCH (i:Incidencia { id: $incidenciaId })
        MERGE (w:CausaPorQue { id: $id })
        SET w.nivel = $nivel,
            w.pregunta = $pregunta,
            w.respuesta = $respuesta
      `;
      await runCypherSafe(cypherWhy, {
        incidenciaId,
        id: why.id,
        nivel: why.nivel,
        pregunta: why.pregunta,
        respuesta: why.respuesta
      });

      if (why.nivel === 1) {
        // Enlazar incidencia con el primer porqué
        const cypherLink1 = `
          MATCH (i:Incidencia { id: $incidenciaId }), (w:CausaPorQue { id: $whyId })
          MERGE (i)-[:CAUSADO_POR]->(w)
        `;
        await runCypherSafe(cypherLink1, { incidenciaId, whyId: why.id });
      }

      if (prevWhyId) {
        // Enlazar causas consecutivas (:CausaPorQue)-[:CONDUCE_A]->(:CausaPorQue)
        const cypherChain = `
          MATCH (wPrev:CausaPorQue { id: $prevId }), (wCurr:CausaPorQue { id: $currId })
          MERGE (wPrev)-[:CONDUCE_A]->(wCurr)
        `;
        await runCypherSafe(cypherChain, { prevId: prevWhyId, currId: why.id });
      }

      prevWhyId = why.id;
    }

    // 5. Crear Accion y relación (:Incidencia)-[:MITIGADA_POR]->(:Accion)
    for (const act of analisis.acciones || []) {
      const cypherAccion = `
        MATCH (i:Incidencia { id: $incidenciaId })
        MERGE (a:Accion { id: $id })
        SET a.disciplina = $disciplina,
            a.tipo = $tipo,
            a.descripcion = $descripcion,
            a.responsable = $responsable,
            a.estado = $estado
        MERGE (i)-[:MITIGADA_POR]->(a)
      `;
      await runCypherSafe(cypherAccion, {
        incidenciaId,
        id: act.id,
        disciplina: act.disciplina,
        tipo: act.tipo,
        descripcion: act.descripcion,
        responsable: act.responsable,
        estado: act.estado
      });
    }

    console.log(`[Memgraph] Incidencia ${incidenciaId} y su grafo persistidos con éxito.`);
  } catch (e: any) {
    console.warn(`[Memgraph] Persistencia remota no completada, conservando en memoria:`, e?.message || e);
  }

  return incidenciaId;
}

/**
 * Obtiene el listado de incidencias (desde Memgraph con respaldo local)
 */
export async function getIncidentes(): Promise<Incidencia[]> {
  const query = `
    MATCH (i:Incidencia)
    RETURN i
    ORDER BY i.creadoEn DESC
  `;

  const records = await runCypherSafe<{ i: any }>(query);

  if (records && records.length > 0) {
    return records.map((r) => {
      const props = r.i.properties || r.i;
      const mem = memoryStore.get(props.id);
      return {
        id: props.id,
        descripcion: props.descripcion || mem?.descripcion || 'Sin descripción',
        area: props.area || mem?.area || 'Línea de Ensamble',
        severidad: props.severidad || mem?.severidad || 'Media',
        estado: props.estado || mem?.estado || 'En Auditoría',
        causaRaiz: props.causaRaiz || mem?.causaRaiz || 'Por determinar',
        creadoEn: props.creadoEn || mem?.creadoEn || new Date().toISOString(),
        actualizadoEn: props.actualizadoEn || mem?.actualizadoEn,
        analisis: mem?.analisis,
        nombreAuditor: props.nombreAuditor || mem?.nombreAuditor,
        apellidoAuditor: props.apellidoAuditor || mem?.apellidoAuditor,
        fechaValidacion: props.fechaValidacion || mem?.fechaValidacion,
        notasAuditor: props.notasAuditor || mem?.notasAuditor
      };
    });
  }

  // Devolver el almacén en memoria
  return Array.from(memoryStore.values()).sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
  );
}

/**
 * Obtiene el detalle completo de una incidencia y todo su subgrafo de relaciones
 */
export async function getIncidenteById(id: string): Promise<Incidencia | null> {
  const query = `
    MATCH (i:Incidencia { id: $id })
    OPTIONAL MATCH (i)-[:RESPALDADA_POR]->(e:Evidencia)
    OPTIONAL MATCH (i)-[:EVALUADA_EN]->(f:IshikawaFactor)
    OPTIONAL MATCH (i)-[:CAUSADO_POR]->(w1:CausaPorQue)
    OPTIONAL MATCH (w1)-[:CONDUCE_A*0..4]->(w:CausaPorQue)
    OPTIONAL MATCH (i)-[:MITIGADA_POR]->(a:Accion)
    RETURN i,
           collect(DISTINCT e) AS evidencias,
           collect(DISTINCT f) AS ishikawa,
           collect(DISTINCT w) AS cincoPorques,
           collect(DISTINCT a) AS acciones
  `;

  const records = await runCypherSafe<any>(query, { id });

  if (records && records.length > 0 && records[0].i) {
    const row = records[0];
    const props = row.i.properties || row.i;
    const mem = memoryStore.get(id);

    const parseNodeList = (list: any[]) =>
      (list || []).map((node) => node.properties || node).filter((n) => n && n.id);

    const evidencias: Evidencia[] = parseNodeList(row.evidencias);
    const ishikawa: IshikawaFactor[] = parseNodeList(row.ishikawa);
    const cincoPorques: CausaPorQue[] = parseNodeList(row.cincoPorques).sort((a, b) => a.nivel - b.nivel);
    const acciones: Accion[] = parseNodeList(row.acciones);

    const disciplinas8d = {
      d1_equipo: props.d1_equipo || mem?.analisis?.disciplinas8d?.d1_equipo || ['Líder Calidad', 'Procesos', 'Mantenimiento'],
      d2_descripcion: props.d2_descripcion || mem?.analisis?.disciplinas8d?.d2_descripcion || props.descripcion,
      d3_contencion: props.d3_contencion || mem?.analisis?.disciplinas8d?.d3_contencion || 'Contención en línea',
      d4_causaRaiz: props.d4_causaRaiz || mem?.analisis?.disciplinas8d?.d4_causaRaiz || props.causaRaiz,
      d5_accionesCorrectivas: props.d5_accionesCorrectivas || mem?.analisis?.disciplinas8d?.d5_accionesCorrectivas || 'Ajuste permanente',
      d6_implementacion: props.d6_implementacion || mem?.analisis?.disciplinas8d?.d6_implementacion || 'Validación en lote piloto',
      d7_prevencion: props.d7_prevencion || mem?.analisis?.disciplinas8d?.d7_prevencion || 'Poka-Yoke preventivo',
      d8_cierre: props.d8_cierre || mem?.analisis?.disciplinas8d?.d8_cierre || 'Cierre formal y lección aprendida'
    };

    return {
      id: props.id,
      descripcion: props.descripcion,
      area: props.area,
      severidad: props.severidad,
      estado: props.estado,
      causaRaiz: props.causaRaiz,
      creadoEn: props.creadoEn,
      actualizadoEn: props.actualizadoEn,
      nombreAuditor: props.nombreAuditor || mem?.nombreAuditor,
      apellidoAuditor: props.apellidoAuditor || mem?.apellidoAuditor,
      fechaValidacion: props.fechaValidacion || mem?.fechaValidacion,
      notasAuditor: props.notasAuditor || mem?.notasAuditor,
      analisis: {
        titulo: props.titulo || mem?.analisis?.titulo || `Incidencia ${props.id}`,
        resumen: props.resumen || mem?.analisis?.resumen || props.descripcion,
        severidad: props.severidad,
        disciplinas8d,
        ishikawa: ishikawa.length > 0 ? ishikawa : (mem?.analisis?.ishikawa || []),
        cincoPorques: cincoPorques.length > 0 ? cincoPorques : (mem?.analisis?.cincoPorques || []),
        acciones: acciones.length > 0 ? acciones : (mem?.analisis?.acciones || []),
        evidencias: evidencias.length > 0 ? evidencias : (mem?.analisis?.evidencias || [])
      }
    };
  }

  // Si no está en el grafo, devolver desde el almacén local
  return memoryStore.get(id) || null;
}

/**
 * Actualiza el estado o validación de un auditor (Humano en el bucle)
 */
export async function updateIncidente(
  id: string,
  updates: Partial<Pick<Incidencia, 'estado' | 'nombreAuditor' | 'apellidoAuditor' | 'notasAuditor' | 'fechaValidacion' | 'causaRaiz'>>
): Promise<boolean> {
  const existente = await getIncidenteById(id);
  if (!existente) return false;

  const ahora = new Date().toISOString();
  const actualizado: Incidencia = {
    ...existente,
    ...updates,
    actualizadoEn: ahora
  };

  memoryStore.set(id, actualizado);

  const query = `
    MATCH (i:Incidencia { id: $id })
    SET i.estado = coalesce($estado, i.estado),
        i.nombreAuditor = coalesce($nombreAuditor, i.nombreAuditor),
        i.apellidoAuditor = coalesce($apellidoAuditor, i.apellidoAuditor),
        i.notasAuditor = coalesce($notasAuditor, i.notasAuditor),
        i.fechaValidacion = coalesce($fechaValidacion, i.fechaValidacion),
        i.causaRaiz = coalesce($causaRaiz, i.causaRaiz),
        i.actualizadoEn = $actualizadoEn
    RETURN i.id AS id
  `;

  await runCypherSafe(query, {
    id,
    estado: updates.estado || null,
    nombreAuditor: updates.nombreAuditor || null,
    apellidoAuditor: updates.apellidoAuditor || null,
    notasAuditor: updates.notasAuditor || null,
    fechaValidacion: updates.fechaValidacion || null,
    causaRaiz: updates.causaRaiz || null,
    actualizadoEn: ahora
  });

  return true;
}
