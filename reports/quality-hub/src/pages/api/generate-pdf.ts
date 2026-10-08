import type { APIRoute } from 'astro';
import { getIncidenteById } from '../../lib/memgraph';
import { generateQualityPdf, renderQualityReportHtml } from '../../lib/pdf';
import type { Incidencia } from '../../lib/types';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const format = url.searchParams.get('format');

  if (!id) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Parámetro "id" requerido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const incidente = await getIncidenteById(id);
    if (!incidente) {
      return new Response(
        JSON.stringify({ ok: false, error: `Incidencia ${id} no encontrada` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Si el usuario solicita explícitamente HTML imprimible
    if (format === 'html') {
      const html = renderQualityReportHtml(incidente, { autoDownload: false, includeClientScript: true });
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }

    // Intentar generar PDF con Gotenberg
    const pdfResult = await generateQualityPdf(incidente);

    if (pdfResult.ok && pdfResult.buffer) {
      return new Response(pdfResult.buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Reporte-8D-${id}-Carta.pdf"`
        }
      });
    }

    // Fallback: Gotenberg no está activo en este momento. Servir vista HTML lista con auto-descarga a PDF tamaño Carta
    const htmlFallback = pdfResult.html || renderQualityReportHtml(incidente, { autoDownload: true, includeClientScript: true });
    return new Response(htmlFallback, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Gotenberg-Fallback': 'true'
      }
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Error al generar documento PDF' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const incidente = data as Incidencia;

    if (!incidente || !incidente.id || !incidente.analisis) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Cuerpo JSON inválido. Se requiere un objeto Incidencia completo.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Intentar generar PDF con Gotenberg
    const pdfResult = await generateQualityPdf(incidente);

    if (pdfResult.ok && pdfResult.buffer) {
      return new Response(pdfResult.buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Reporte-8D-${incidente.id}-Carta.pdf"`
        }
      });
    }

    // Fallback HTML
    const htmlFallback = pdfResult.html || renderQualityReportHtml(incidente, { autoDownload: true, includeClientScript: true });
    return new Response(htmlFallback, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Gotenberg-Fallback': 'true'
      }
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Error procesando JSON o generando PDF' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
