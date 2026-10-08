import type { APIRoute } from 'astro';
import { getIncidenteById, updateIncidente } from '../../../lib/memgraph';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};

// GET /api/incidentes/:id -> Obtener subgrafo completo de la incidencia
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: 'ID de incidencia requerido' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const incidente = await getIncidenteById(id);
    if (!incidente) {
      return new Response(
        JSON.stringify({ ok: false, error: `Incidencia ${id} no encontrada` }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ ok: true, incidente }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Error al recuperar la incidencia' }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// PATCH /api/incidentes/:id -> Actualizar validación de auditor (Humano en el bucle)
export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: 'ID requerido' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const body = await request.json();
    const { estado, validadoPor, notasAuditor, causaRaiz, fechaValidacion } = body;

    const actualizado = await updateIncidente(id, {
      estado,
      validadoPor,
      notasAuditor,
      causaRaiz,
      fechaValidacion: fechaValidacion || new Date().toISOString()
    });

    if (!actualizado) {
      return new Response(
        JSON.stringify({ ok: false, error: `Incidencia ${id} no encontrada para actualización` }),
        { status: 404, headers: corsHeaders }
      );
    }

    const incidenteActualizado = await getIncidenteById(id);

    return new Response(
      JSON.stringify({
        ok: true,
        mensaje: 'Incidencia actualizada satisfactoriamente',
        incidente: incidenteActualizado
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Error al actualizar incidencia' }),
      { status: 500, headers: corsHeaders }
    );
  }
};

export const PUT = PATCH;
