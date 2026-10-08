import { z } from 'zod';

// ==========================================
// ESQUEMAS ZOD Y TIPOS TYPESCRIPT ESTRICTOS
// Neurona y Media Quality Challenge - Quality Hub
// ==========================================

export const CategoriaIshikawaEnum = z.enum([
  'Mano de Obra',
  'Maquinaria',
  'Materiales',
  'Método',
  'Medio Ambiente',
  'Medición'
]);
export type CategoriaIshikawa = z.infer<typeof CategoriaIshikawaEnum>;

export const SeveridadEnum = z.enum(['Baja', 'Media', 'Alta', 'Crítica']);
export type Severidad = z.infer<typeof SeveridadEnum>;

export const EstadoIncidenciaEnum = z.enum([
  'Pendiente',
  'En Auditoría',
  'Validada',
  'Mitigada',
  'Cerrada'
]);
export type EstadoIncidencia = z.infer<typeof EstadoIncidenciaEnum>;

export const DisciplinaTipoEnum = z.enum(['D3', 'D5', 'D7']);
export type DisciplinaTipo = z.infer<typeof DisciplinaTipoEnum>;

export const EstadoAccionEnum = z.enum(['Pendiente', 'En Proceso', 'Completada']);
export type EstadoAccion = z.infer<typeof EstadoAccionEnum>;

// Nodo: Evidencia
export const EvidenciaSchema = z.object({
  id: z.string().default(() => `evi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  tipo: z.string().default('Telemetría'),
  descripcion: z.string(),
  valor: z.string().optional().default('N/A'),
  url: z.string().optional().default('')
});
export type Evidencia = z.infer<typeof EvidenciaSchema>;

// Nodo: IshikawaFactor
export const IshikawaFactorSchema = z.object({
  id: z.string().default(() => `ish-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  categoria: CategoriaIshikawaEnum,
  factor: z.string(),
  descripcion: z.string(),
  impacto: z.enum(['Alto', 'Medio', 'Bajo']).default('Medio'),
  esCausaRaiz: z.boolean().default(false)
});
export type IshikawaFactor = z.infer<typeof IshikawaFactorSchema>;

// Nodo: CausaPorQue (5 Porqués)
export const CausaPorQueSchema = z.object({
  id: z.string().default(() => `why-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  nivel: z.number().int().min(1).max(5),
  pregunta: z.string(),
  respuesta: z.string()
});
export type CausaPorQue = z.infer<typeof CausaPorQueSchema>;

// Nodo: Accion
export const AccionSchema = z.object({
  id: z.string().default(() => `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  disciplina: DisciplinaTipoEnum,
  tipo: z.string(), // Contención, Correctiva, Preventiva
  descripcion: z.string(),
  responsable: z.string().default('Equipo de Calidad'),
  estado: EstadoAccionEnum.default('Pendiente')
});
export type Accion = z.infer<typeof AccionSchema>;

// Estructura 8D
export const Disciplinas8DSchema = z.object({
  d1_equipo: z.array(z.string()).default(['Líder de Calidad', 'Ingeniero de Proceso', 'Operador de Línea']),
  d2_descripcion: z.string(),
  d3_contencion: z.string(),
  d4_causaRaiz: z.string(),
  d5_accionesCorrectivas: z.string(),
  d6_implementacion: z.string(),
  d7_prevencion: z.string(),
  d8_cierre: z.string()
});
export type Disciplinas8D = z.infer<typeof Disciplinas8DSchema>;

// Esquema de Salida Completa Estructurada (Gemini)
export const AnalisisCalidadSchema = z.object({
  titulo: z.string(),
  resumen: z.string(),
  severidad: SeveridadEnum.default('Media'),
  disciplinas8d: Disciplinas8DSchema,
  ishikawa: z.array(IshikawaFactorSchema),
  cincoPorques: z.array(CausaPorQueSchema).length(5, 'Se requieren exactamente 5 porqués'),
  acciones: z.array(AccionSchema),
  evidencias: z.array(EvidenciaSchema).default([])
});
export type AnalisisCalidad = z.infer<typeof AnalisisCalidadSchema>;

// Nodo: Incidencia
export const IncidenciaSchema = z.object({
  id: z.string(),
  descripcion: z.string(),
  area: z.string(),
  severidad: SeveridadEnum.default('Media'),
  estado: EstadoIncidenciaEnum.default('Pendiente'),
  causaRaiz: z.string(),
  creadoEn: z.string(),
  actualizadoEn: z.string().optional(),
  analisis: AnalisisCalidadSchema.optional(),
  validadoPor: z.string().optional(),
  fechaValidacion: z.string().optional(),
  notasAuditor: z.string().optional()
});
export type Incidencia = z.infer<typeof IncidenciaSchema>;

// Estructura de respuesta estándar para API
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  id?: string;
  analisis?: AnalisisCalidad;
  incidentes?: Incidencia[];
  incidente?: Incidencia;
  error?: string;
}
