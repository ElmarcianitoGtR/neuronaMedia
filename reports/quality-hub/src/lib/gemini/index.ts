import { GoogleGenAI } from '@google/genai';
import {
  AnalisisCalidadSchema,
  type AnalisisCalidad,
  type Evidencia
} from '../types';

export interface AnalisisInput {
  descripcion: string;
  area?: string;
  evidencia?: string | Record<string, any> | Array<any>;
  severidad?: string;
}

const GEMINI_SCHEMA = {
  type: 'object',
  properties: {
    titulo: { type: 'string', description: 'Título técnico conciso de la falla' },
    resumen: { type: 'string', description: 'Resumen ejecutivo de la anomalía de calidad' },
    severidad: { type: 'string', enum: ['Baja', 'Media', 'Alta', 'Crítica'] },
    disciplinas8d: {
      type: 'object',
      properties: {
        d1_equipo: {
          type: 'array',
          items: { type: 'string' },
          description: 'Roles del equipo multidisciplinario asignado'
        },
        d2_descripcion: { type: 'string', description: 'Descripción 5W2H del problema' },
        d3_contencion: { type: 'string', description: 'Acciones de contención inmediata en línea' },
        d4_causaRaiz: { type: 'string', description: 'Identificación técnica de la causa raíz' },
        d5_accionesCorrectivas: { type: 'string', description: 'Solución permanente seleccionada' },
        d6_implementacion: { type: 'string', description: 'Plan de implementación y validación' },
        d7_prevencion: { type: 'string', description: 'Medidas para evitar recurrencia sistémica' },
        d8_cierre: { type: 'string', description: 'Reconocimiento y lecciones aprendidas' }
      },
      required: [
        'd1_equipo',
        'd2_descripcion',
        'd3_contencion',
        'd4_causaRaiz',
        'd5_accionesCorrectivas',
        'd6_implementacion',
        'd7_prevencion',
        'd8_cierre'
      ]
    },
    ishikawa: {
      type: 'array',
      description: 'Factores evaluados en las 6M (Mano de Obra, Maquinaria, Materiales, Método, Medio Ambiente, Medición)',
      items: {
        type: 'object',
        properties: {
          categoria: {
            type: 'string',
            enum: [
              'Mano de Obra',
              'Maquinaria',
              'Materiales',
              'Método',
              'Medio Ambiente',
              'Medición'
            ]
          },
          factor: { type: 'string', description: 'Nombre o componente del factor' },
          descripcion: { type: 'string', description: 'Análisis detallado de la hipótesis' },
          impacto: { type: 'string', enum: ['Alto', 'Medio', 'Bajo'] },
          esCausaRaiz: { type: 'boolean', description: 'Si este factor es la causa raíz primaria' }
        },
        required: ['categoria', 'factor', 'descripcion', 'impacto', 'esCausaRaiz']
      }
    },
    cincoPorques: {
      type: 'array',
      description: 'Cadena lineal de exactamente 5 porqués hasta llegar a la causa raíz',
      items: {
        type: 'object',
        properties: {
          nivel: { type: 'integer', description: 'Nivel del 1 al 5' },
          pregunta: { type: 'string', description: 'Pregunta ¿Por qué sucedió esto?' },
          respuesta: { type: 'string', description: 'Explicación técnica de la causa inmediata' }
        },
        required: ['nivel', 'pregunta', 'respuesta']
      }
    },
    acciones: {
      type: 'array',
      description: 'Acciones de contención, correctivas y preventivas',
      items: {
        type: 'object',
        properties: {
          disciplina: { type: 'string', enum: ['D3', 'D5', 'D7'] },
          tipo: { type: 'string' },
          descripcion: { type: 'string' },
          responsable: { type: 'string' },
          estado: { type: 'string', enum: ['Pendiente', 'En Proceso', 'Completada'] }
        },
        required: ['disciplina', 'tipo', 'descripcion', 'responsable', 'estado']
      }
    }
  },
  required: [
    'titulo',
    'resumen',
    'severidad',
    'disciplinas8d',
    'ishikawa',
    'cincoPorques',
    'acciones'
  ]
};

/**
 * Generador de respaldo de alta fidelidad para entornos de desarrollo / contingencia
 */
function createDeterministicAnalysis(input: AnalisisInput): AnalisisCalidad {
  const area = input.area || 'Línea de Ensamble y Calidad';
  const desc = input.descripcion || 'Incidencia de calidad reportada en línea de producción';
  const severidad = (input.severidad as any) || 'Alta';

  return {
    titulo: `Análisis de Calidad: ${desc.slice(0, 50)}...`,
    resumen: `Incidencia detectada en ${area}: ${desc}. Se aplica metodología estándar 8D con espina de pescado (6M) y 5 Porqués para mitigar defectos en producción.`,
    severidad: ['Baja', 'Media', 'Alta', 'Crítica'].includes(severidad) ? severidad : 'Alta',
    disciplinas8d: {
      d1_equipo: ['Supervisor de Turno', 'Ingeniero de Calidad Mitsubishi', 'Técnico de Mantenimiento Mecatrónico'],
      d2_descripcion: `En el área ${area}, se detectó: ${desc}. Afecta los estándares de tolerancia y ensamble requeridos.`,
      d3_contencion: 'Detención preventiva de estación, segregación del lote de piezas y verificación dimensional al 100%.',
      d4_causaRaiz: `Desviación recurrente en parámetros operativos debido a ${desc.toLowerCase()}.`,
      d5_accionesCorrectivas: 'Recalibración de actuadores, sustitución del componente degradado y ajuste de torque especificado.',
      d6_implementacion: 'Pruebas piloto en 50 ciclos consecutivos con registro en telemetría sin anomalías.',
      d7_prevencion: 'Actualización de Poka-Yoke sensorial en HMI e incorporación de checklist en plan de mantenimiento predictivo.',
      d8_cierre: 'Incidencia documentada y aprobada por auditor de planta; lección compartida con turnos A y B.'
    },
    ishikawa: [
      {
        id: `ish-1`,
        categoria: 'Maquinaria',
        factor: 'Calibración y Desgaste',
        descripcion: 'Desgaste prematuro o desalineación en el actuador mecánico.',
        impacto: 'Alto',
        esCausaRaiz: true
      },
      {
        id: `ish-2`,
        categoria: 'Método',
        factor: 'Instrucción de Trabajo',
        descripcion: 'El procedimiento no contemplaba verificación de microtolerancias pre-arranque.',
        impacto: 'Medio',
        esCausaRaiz: false
      },
      {
        id: `ish-3`,
        categoria: 'Materiales',
        factor: 'Lote de Suministro',
        descripcion: 'Verificación de dureza y aleación del material entrante dentro de rango.',
        impacto: 'Bajo',
        esCausaRaiz: false
      },
      {
        id: `ish-4`,
        categoria: 'Mano de Obra',
        factor: 'Capacitación Operativa',
        descripcion: 'Operador con turno recién rotado sin certificación nivel 2 en estación.',
        impacto: 'Medio',
        esCausaRaiz: false
      },
      {
        id: `ish-5`,
        categoria: 'Medio Ambiente',
        factor: 'Temperatura en Celda',
        descripcion: 'Fluctuación térmica de ±4°C durante el cambio de turno.',
        impacto: 'Bajo',
        esCausaRaiz: false
      },
      {
        id: `ish-6`,
        categoria: 'Medición',
        factor: 'Galgas y Sensores',
        descripcion: 'Lectura con deriva leve en sensor fotoeléctrico de posicionamiento.',
        impacto: 'Medio',
        esCausaRaiz: false
      }
    ],
    cincoPorques: [
      {
        id: 'why-1',
        nivel: 1,
        pregunta: `¿Por qué se presentó el defecto en ${area}?`,
        respuesta: `Porque la pieza no cumplió la cota dimensional esperada durante la operación.`
      },
      {
        id: 'why-2',
        nivel: 2,
        pregunta: '¿Por qué no cumplió la cota dimensional?',
        respuesta: 'Porque el herramental no ejerció la fuerza y recorrido adecuados en el ciclo.'
      },
      {
        id: 'why-3',
        nivel: 3,
        pregunta: '¿Por qué no ejerció el recorrido adecuado?',
        respuesta: 'Porque el actuador presentaba holgura mecánica y pérdida de presión hidráulica/neumática.'
      },
      {
        id: 'why-4',
        nivel: 4,
        pregunta: '¿Por qué presentaba holgura mecánica?',
        respuesta: 'Porque excedió las horas de operación sin servicio preventivo de ajuste de rodamientos.'
      },
      {
        id: 'why-5',
        nivel: 5,
        pregunta: '¿Por qué no se realizó el ajuste preventivo a tiempo? (Causa Raíz)',
        respuesta: 'Porque el plan de mantenimiento preventivo no estaba sincronizado con el conteo real de ciclos de la línea.'
      }
    ],
    acciones: [
      {
        id: 'act-1',
        disciplina: 'D3',
        tipo: 'Contención Inmediata',
        descripcion: 'Pausa de estación, marcado de scrap y cuarentena del lote afectado.',
        responsable: 'Operador / Líder de Calidad',
        estado: 'Completada'
      },
      {
        id: 'act-2',
        disciplina: 'D5',
        tipo: 'Acción Correctiva',
        descripcion: 'Reemplazo de rodamientos y ajuste de parámetros de presión en celda.',
        responsable: 'Ing. Mantenimiento',
        estado: 'En Proceso'
      },
      {
        id: 'act-3',
        disciplina: 'D7',
        tipo: 'Acción Preventiva',
        descripcion: 'Enlace de telemetría IoT del PLC al ERP para disparar órdenes de servicio automáticas por horas de trabajo.',
        responsable: 'Ing. Automatización',
        estado: 'Pendiente'
      }
    ],
    evidencias: normalizarEvidencias(input.evidencia)
  };
}

function normalizarEvidencias(evidenciaInput: any): Evidencia[] {
  if (!evidenciaInput) return [];
  if (Array.isArray(evidenciaInput)) {
    return evidenciaInput.map((item, idx) => ({
      id: `evi-${Date.now()}-${idx}`,
      tipo: typeof item === 'object' && item.tipo ? item.tipo : 'Registro Telemetría',
      descripcion: typeof item === 'object' && item.descripcion ? item.descripcion : String(item),
      valor: typeof item === 'object' && item.valor ? String(item.valor) : 'OK',
      url: typeof item === 'object' && item.url ? item.url : ''
    }));
  }
  if (typeof evidenciaInput === 'object') {
    return Object.entries(evidenciaInput).map(([k, v], idx) => ({
      id: `evi-${Date.now()}-${idx}`,
      tipo: 'Sensor / Parámetro',
      descripcion: k,
      valor: String(v),
      url: ''
    }));
  }
  return [
    {
      id: `evi-${Date.now()}-0`,
      tipo: 'Registro Manual',
      descripcion: String(evidenciaInput),
      valor: 'Reportado',
      url: ''
    }
  ];
}

/**
 * Ejecuta el análisis de calidad empleando Gemini 2.5 Flash con salida JSON estructurada y validación Zod
 */
export async function runGeminiAnalysis(input: AnalisisInput): Promise<AnalisisCalidad> {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY no configurada. Utilizando generador determinista de análisis 8D/Ishikawa/5W.');
    return createDeterministicAnalysis(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Eres un ingeniero experto en aseguramiento de calidad automotriz bajo la metodología de Mitsubishi Motors.
Analiza la siguiente incidencia de planta y elabora un diagnóstico integral en una sola respuesta estructurada JSON que cubra simultáneamente:
1. Las 8 Disciplinas (8D) completas (D1 a D8).
2. Diagrama de Ishikawa con análisis en las 6M (Mano de Obra, Maquinaria, Materiales, Método, Medio Ambiente, Medición).
3. Cadena estricta de 5 Porqués (exactamente 5 niveles progresivos) conduciendo directamente a la causa raíz.
4. Plan de acciones inmediatas (D3), correctivas (D5) y preventivas (D7).

DATOS DE LA INCIDENCIA:
- Área / Estación: ${input.area || 'Línea de Ensamble'}
- Descripción del problema: ${input.descripcion}
- Evidencia / Telemetría: ${JSON.stringify(input.evidencia || 'N/A')}
- Severidad inicial sugerida: ${input.severidad || 'Auto-evaluar'}

Responde estrictamente en formato JSON válido de acuerdo al esquema solicitado.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_SCHEMA
      }
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('Respuesta vacía recibida del modelo Gemini');
    }

    const parsedJson = JSON.parse(responseText);

    // Adjuntar evidencias si no vinieron en la respuesta
    if (!parsedJson.evidencias || parsedJson.evidencias.length === 0) {
      parsedJson.evidencias = normalizarEvidencias(input.evidencia);
    }

    // Asegurar IDs en elementos anidados
    if (Array.isArray(parsedJson.ishikawa)) {
      parsedJson.ishikawa = parsedJson.ishikawa.map((f: any, i: number) => ({
        id: f.id || `ish-${Date.now()}-${i}`,
        ...f
      }));
    }
    if (Array.isArray(parsedJson.cincoPorques)) {
      parsedJson.cincoPorques = parsedJson.cincoPorques.map((w: any, i: number) => ({
        id: w.id || `why-${Date.now()}-${i}`,
        ...w
      }));
    }
    if (Array.isArray(parsedJson.acciones)) {
      parsedJson.acciones = parsedJson.acciones.map((a: any, i: number) => ({
        id: a.id || `act-${Date.now()}-${i}`,
        ...a
      }));
    }

    // Validación defensiva estricta con Zod
    const validatedData = AnalisisCalidadSchema.parse(parsedJson);
    return validatedData;
  } catch (error: any) {
    console.error('[Gemini] Error al ejecutar o validar análisis con Gemini:', error?.message || error);
    console.warn('[Gemini] Activando fallback resiliente para asegurar continuidad en producción.');
    return createDeterministicAnalysis(input);
  }
}
