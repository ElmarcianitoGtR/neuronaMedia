import type { APIRoute } from 'astro';
import { runGeminiAnalysis } from '../../lib/gemini';
import { saveToMemgraph, getIncidentes } from '../../lib/memgraph';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};

// GET /api/incidentes -> Listar todas las incidencias (CORS habilitado para master-slave)
export const GET: APIRoute = async () => {
  try {
    const incidentes = await getIncidentes();
    return new Response(
      JSON.stringify({
        ok: true,
        total: incidentes.length,
        incidentes
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Error al obtener incidencias' }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
};

// POST /api/incidentes -> Ingesta de incidencias desde master-slave o consola web
export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ ok: false, error: 'El cuerpo de la solicitud debe ser un JSON válido' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { descripcion, area, evidencia, severidad, id } = body;

    if (!descripcion || typeof descripcion !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'El campo "descripcion" es obligatorio' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Procesar con Gemini (extracción estructurada de 8D, Ishikawa y 5 Porqués en una sola llamada)
    const analisis = await runGeminiAnalysis({
      descripcion,
      area: area || 'Línea de Producción',
      evidencia,
      severidad
    });

    // 2. Persistir en la base de datos de grafos Memgraph
    const incidenciaId = await saveToMemgraph(analisis, {
      id,
      area: area || 'Línea de Producción',
      descripcionOriginal: descripcion
    });

    // 3. Responder con JSON estándar y cabeceras CORS
    return new Response(
      JSON.stringify({
        ok: true,
        id: incidenciaId,
        analisis
      }),
      {
        status: 201,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Error interno del servidor' }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
};
