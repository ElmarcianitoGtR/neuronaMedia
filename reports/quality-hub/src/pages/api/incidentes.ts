import type { APIRoute } from 'astro';
import { runGeminiAnalysis } from '../../lib/gemini';
import { saveToMemgraph } from '../../lib/memgraph';

// POST /api/incidentes -> Consumible por master-slave
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { descripcion, area, evidencia } = body;

    // 1. Procesar con Gemini (extracción estructurada a 8D, Ishikawa, 5W)
    const analisis = await runGeminiAnalysis({ descripcion, area, evidencia });

    // 2. Guardar en la base de datos de grafos
    const incidenciaId = await saveToMemgraph(analisis);

    // 3. Responder JSON estructurado
    return new Response(
      JSON.stringify({
        ok: true,
        id: incidenciaId,
        analisis
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Permite llamadas entre retos
        }
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
