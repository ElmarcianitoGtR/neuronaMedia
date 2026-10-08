import type { Incidencia } from '../types';
import { renderQualityReportHtml } from './template';

export { renderQualityReportHtml };

export interface PdfGenerationResult {
  ok: boolean;
  buffer?: Buffer;
  html?: string;
  contentType: string;
  error?: string;
}

/**
 * Genera el documento PDF formal delegando al servicio Gotenberg vía HTTP multipart
 */
export async function generateQualityPdf(incidente: Incidencia): Promise<PdfGenerationResult> {
  const htmlContent = renderQualityReportHtml(incidente);

  // Intentar Gotenberg en 4650 (según docker-compose.yml) o 3001 (según agent.md)
  const candidateUrls = [
    process.env.PDF_RENDERER_URL,
    'http://localhost:4650',
    'http://localhost:3001',
    'http://127.0.0.1:4650'
  ].filter(Boolean) as string[];

  // Quitar duplicados
  const uniqueUrls = Array.from(new Set(candidateUrls));

  for (const baseUrl of uniqueUrls) {
    try {
      const endpoint = `${baseUrl.replace(/\/$/, '')}/forms/chromium/convert/html`;

      const formData = new FormData();
      const blob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' });
      formData.append('files', blob, 'index.html');
      formData.append('preferCssPageSize', 'true');
      formData.append('printBackground', 'true');
      formData.append('marginTop', '0.3');
      formData.append('marginBottom', '0.3');
      formData.append('marginLeft', '0.3');
      formData.append('marginRight', '0.3');

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(6000)
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return {
          ok: true,
          buffer,
          contentType: 'application/pdf'
        };
      }
    } catch (err: any) {
      // Intentar el siguiente candidato
      continue;
    }
  }

  // Fallback: Gotenberg no está en ejecución actualmente. Devolver HTML optimizado para imprimir
  console.warn('[Gotenberg] Contenedor Gotenberg no alcanzable en URLs configuradas. Retornando HTML imprimible.');
  return {
    ok: false,
    html: htmlContent,
    contentType: 'text/html',
    error: 'Gotenberg headless service not reachable. Retornando vista de impresión directa.'
  };
}
