import type { Incidencia, IshikawaFactor } from '../types';

function wrapSvgText(text: string, maxLineLen: number, maxLines: number = 4): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxLineLen) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  return lines;
}

function renderFishboneSvgForLetter(ishikawa: IshikawaFactor[], problema: string): string {
  const topCats = [
    { key: 'Maquinaria', label: 'MAQUINARIA', xTip: 250, xSpine: 400, labelX: 140, labelY: 50 },
    { key: 'Método', label: 'MÉTODO', xTip: 550, xSpine: 700, labelX: 440, labelY: 50 },
    { key: 'Mano de Obra', label: 'MANO DE OBRA', xTip: 850, xSpine: 1000, labelX: 740, labelY: 50 }
  ];

  const bottomCats = [
    { key: 'Materiales', label: 'MATERIALES', xTip: 250, xSpine: 400, labelX: 140, labelY: 650 },
    { key: 'Medición', label: 'MEDICIÓN', xTip: 550, xSpine: 700, labelX: 440, labelY: 650 },
    { key: 'Medio Ambiente', label: 'MEDIO AMBIENTE', xTip: 850, xSpine: 1000, labelX: 740, labelY: 650 }
  ];

  const getFactors = (cat: string) => ishikawa.filter(f => f.categoria.toLowerCase() === cat.toLowerCase());
  const problemLines = wrapSvgText(problema, 22, 6);

  let svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 700" width="730" height="365" style="width: 730px; height: 365px; margin: 0 auto; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <defs>
      <marker id="fishbone-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f766e" />
      </marker>
      <marker id="fishbone-subarrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
      </marker>
      <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>

    <!-- Fondo sutil de la espina -->
    <rect width="1400" height="700" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />

    <!-- Columna Vertebral Principal -->
    <line x1="40" y1="350" x2="1060" y2="350" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#fishbone-arrow)" />

    <!-- Cabeza del Pescado (Efecto / Problema) -->
    <g transform="translate(1080, 240)">
      <rect width="280" height="220" rx="6" fill="url(#headGrad)" stroke="#dc2626" stroke-width="4" />
      <rect width="280" height="45" rx="4" fill="#b91c1c" />
      <text x="140" y="30" fill="#ffffff" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="1">EFECTO / DEFECTO</text>
      <text x="20" y="80" fill="#f1f5f9" font-size="18" font-weight="600">
        ${problemLines.map((line, idx) => `<tspan x="20" dy="${idx === 0 ? 0 : 26}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</tspan>`).join('')}
      </text>
    </g>
  `;

  // Costillas Superiores
  topCats.forEach(cat => {
    const factors = getFactors(cat.key);
    svg += `
      <!-- Categoría Superior -->
      <rect x="${cat.labelX}" y="${cat.labelY - 30}" width="220" height="45" rx="6" fill="#0f766e" />
      <text x="${cat.labelX + 110}" y="${cat.labelY}" fill="#ffffff" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="1">${cat.label}</text>
      <line x1="${cat.xTip}" y1="${cat.labelY + 15}" x2="${cat.xSpine}" y2="350" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
    `;

    factors.forEach((f, idx) => {
      const ratio = (idx + 1) / (factors.length + 1);
      const branchY = 80 + ratio * 270;
      const branchXOnRib = cat.xTip + ratio * (cat.xSpine - cat.xTip);
      const lineLen = 40;
      const boxWidth = 230;
      const boxHeight = 40;
      const startX = branchXOnRib - lineLen;
      const isRoot = f.esCausaRaiz;

      svg += `
        <line x1="${startX}" y1="${branchY}" x2="${branchXOnRib}" y2="${branchY}" stroke="${isRoot ? '#dc2626' : '#94a3b8'}" stroke-width="3" marker-end="url(#fishbone-subarrow)" />
        <rect x="${startX - boxWidth}" y="${branchY - boxHeight/2}" width="${boxWidth}" height="${boxHeight}" rx="4" fill="${isRoot ? '#fee2e2' : '#ffffff'}" stroke="${isRoot ? '#dc2626' : '#cbd5e1'}" stroke-width="${isRoot ? '3' : '2'}" />
        <text x="${startX - boxWidth/2}" y="${branchY + 6}" fill="${isRoot ? '#991b1b' : '#0f172a'}" font-size="16" font-weight="${isRoot ? '700' : '600'}" text-anchor="middle">
          ${f.factor.length > 25 ? f.factor.substring(0, 24) + '…' : f.factor}
        </text>
      `;
    });
  });

  // Costillas Inferiores
  bottomCats.forEach(cat => {
    const factors = getFactors(cat.key);
    svg += `
      <!-- Categoría Inferior -->
      <rect x="${cat.labelX}" y="${cat.labelY - 15}" width="220" height="45" rx="6" fill="#0f766e" />
      <text x="${cat.labelX + 110}" y="${cat.labelY + 15}" fill="#ffffff" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="1">${cat.label}</text>
      <line x1="${cat.xTip}" y1="${cat.labelY - 15}" x2="${cat.xSpine}" y2="350" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
    `;

    factors.forEach((f, idx) => {
      const ratio = (idx + 1) / (factors.length + 1);
      const branchY = 620 - ratio * 270;
      const branchXOnRib = cat.xTip + ratio * (cat.xSpine - cat.xTip);
      const lineLen = 40;
      const boxWidth = 230;
      const boxHeight = 40;
      const startX = branchXOnRib - lineLen;
      const isRoot = f.esCausaRaiz;

      svg += `
        <line x1="${startX}" y1="${branchY}" x2="${branchXOnRib}" y2="${branchY}" stroke="${isRoot ? '#dc2626' : '#94a3b8'}" stroke-width="3" marker-end="url(#fishbone-subarrow)" />
        <rect x="${startX - boxWidth}" y="${branchY - boxHeight/2}" width="${boxWidth}" height="${boxHeight}" rx="4" fill="${isRoot ? '#fee2e2' : '#ffffff'}" stroke="${isRoot ? '#dc2626' : '#cbd5e1'}" stroke-width="${isRoot ? '3' : '2'}" />
        <text x="${startX - boxWidth/2}" y="${branchY + 6}" fill="${isRoot ? '#991b1b' : '#0f172a'}" font-size="16" font-weight="${isRoot ? '700' : '600'}" text-anchor="middle">
          ${f.factor.length > 25 ? f.factor.substring(0, 24) + '…' : f.factor}
        </text>
      `;
    });
  });

  svg += `</svg>`;
  return svg;
}

export function renderQualityReportHtml(
  incidente: Incidencia,
  options: { autoDownload?: boolean; includeClientScript?: boolean } = {}
): string {
  const analisis = incidente.analisis;
  const d = analisis?.disciplinas8d;
  const ishikawa = analisis?.ishikawa || [];
  const whys = analisis?.cincoPorques || [];
  const acciones = analisis?.acciones || [];
  const evidencias = analisis?.evidencias || [];
  const autoDownload = options.autoDownload ?? false;
  const includeClientScript = options.includeClientScript ?? true;

  const severidadColor =
    incidente.severidad === 'Crítica'
      ? { bg: '#fee2e2', text: '#991b1b', border: '#f87171' }
      : incidente.severidad === 'Alta'
      ? { bg: '#ffedd5', text: '#9a3412', border: '#fb923c' }
      : incidente.severidad === 'Media'
      ? { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' }
      : { bg: '#dcfce7', text: '#166534', border: '#86efac' };

  const estadoColor =
    incidente.estado === 'Validada' || incidente.estado === 'Mitigada' || incidente.estado === 'Cerrada'
      ? { bg: '#dcfce7', text: '#166534', border: '#86efac' }
      : { bg: '#e0f2fe', text: '#075985', border: '#7dd3fc' };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte 8D - ${incidente.id} - Mitsubishi Motors Quality Challenge</title>
  ${includeClientScript ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>' : ''}
  <style>
    /* CONFIGURACIÓN ESTRICTA PARA HOJAS TAMAÑO CARTA (8.5 x 11 pulgadas) */
    @page {
      size: letter portrait;
      margin: 10mm 12mm 10mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      font-size: 10px;
      line-height: 1.35;
      -webkit-font-smoothing: antialiased;
    }

    /* BARRA SUPERIOR NO IMPRIMIBLE */
    .no-print {
      display: block;
    }

    @media print {
      body {
        background: #ffffff;
      }
      .no-print {
        display: none !important;
      }
      .page-sheet {
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }

    /* CONTENEDOR PRINCIPAL TAMAÑO CARTA */
    #report-document {
      max-width: 8.5in;
      margin: 0 auto;
    }

    .page-sheet {
      position: relative;
      background: #ffffff;
      padding: 18px 24px;
      margin: 15px auto;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      border-radius: 2px;
    }

    .page-break {
      page-break-before: always;
    }

    /* ENCABEZADO CORPORATIVO MITSUBISHI */
    .top-header {
      display: table;
      width: 100%;
      border-bottom: 2.5px solid #dc2626;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }

    .brand-cell {
      display: table-cell;
      vertical-align: middle;
      width: 65%;
    }

    .meta-cell {
      display: table-cell;
      vertical-align: middle;
      text-align: right;
      width: 35%;
    }

    .logo-badge {
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }

    .corp-name {
      display: inline-block;
      vertical-align: middle;
    }

    .corp-title {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.8px;
      color: #0f172a;
      text-transform: uppercase;
    }

    .corp-subtitle {
      font-size: 8.5px;
      font-weight: 700;
      color: #dc2626;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .badge-pill {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 9999px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* SECCIONES Y TARJETAS MODERNAS */
    .section-banner {
      display: flex;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 4px 8px;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border-radius: 2px;
      margin-top: 8px;
      margin-bottom: 6px;
    }

    .card-modern {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 8px;
      margin-bottom: 6px;
    }

    /* METADATOS EN GRID 4 COLUMNAS */
    .meta-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 8px;
      border-collapse: separate;
      border-spacing: 4px;
    }

    .meta-item {
      display: table-cell;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 5px 8px;
      vertical-align: top;
    }

    .meta-label {
      font-size: 7.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .meta-value {
      font-size: 9.5px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 1px;
    }

    /* CUADRÍCULA DE LAS 8 DISCIPLINAS (8D) */
    .grid-8d {
      display: table;
      width: 100%;
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 4px;
      margin-bottom: 8px;
    }

    .row-8d {
      display: table-row;
    }

    .col-8d {
      display: table-cell;
      width: 25%;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 6px;
      vertical-align: top;
    }

    .col-8d.root-highlight {
      border: 1.5px solid #dc2626;
      background: #fff5f5;
    }

    .d-badge {
      display: inline-block;
      font-size: 7.5px;
      font-weight: 800;
      color: #0f766e;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 2px;
    }

    .col-8d.root-highlight .d-badge {
      color: #dc2626;
    }

    .d-title {
      font-size: 8.5px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 3px;
    }

    .d-text {
      font-size: 8px;
      color: #334155;
      line-height: 1.3;
    }

    /* TABLAS ESTILIZADAS PARA ACCIONES */
    table.table-modern {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 8.5px;
    }

    table.table-modern th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8px;
      letter-spacing: 0.4px;
      padding: 5px 6px;
      border: 1px solid #0f172a;
      text-align: left;
    }

    table.table-modern td {
      border: 1px solid #e2e8f0;
      padding: 4px 6px;
      color: #1e293b;
    }

    table.table-modern tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* 5 PORQUÉS EN LÍNEA HORIZONTAL */
    .grid-whys {
      display: table;
      width: 100%;
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 3px;
      margin-bottom: 8px;
    }

    .col-why {
      display: table-cell;
      width: 20%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      padding: 5px;
      vertical-align: top;
    }

    .col-why.final-root {
      background: #fef2f2;
      border: 1.5px solid #dc2626;
    }

    .why-header {
      font-size: 8px;
      font-weight: 800;
      color: #0284c7;
      text-transform: uppercase;
    }

    .col-why.final-root .why-header {
      color: #dc2626;
    }

    .why-q {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 2px;
      line-height: 1.2;
    }

    .why-a {
      font-size: 7.5px;
      color: #475569;
      margin-top: 3px;
      line-height: 1.25;
      border-top: 1px solid #e2e8f0;
      padding-top: 2px;
    }

    /* CERTIFICACIÓN Y FIRMAS */
    .cert-box {
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      background: #ffffff;
      padding: 8px;
      margin-top: 10px;
      page-break-inside: avoid;
    }

    .cert-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .cert-col {
      display: table-cell;
      width: 50%;
      vertical-align: top;
      padding: 0 10px;
      text-align: center;
    }

    .sig-line {
      border-top: 1px solid #475569;
      margin-top: 24px;
      padding-top: 3px;
      font-weight: 700;
      font-size: 8.5px;
      color: #0f172a;
    }

    .sig-meta {
      font-size: 7.5px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- BARRA SUPERIOR FLOTANTE DE DESCARGA (SOLO VISIBLE EN PANTALLA) -->
  <div class="no-print" style="position: sticky; top: 0; z-index: 1000; background: #0f172a; color: #ffffff; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border-bottom: 2px solid #0d9488;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
      <span style="font-size: 13px; font-weight: bold; letter-spacing: 0.5px;">MITSUBISHI QUALITY ASSURANCE // REPORTE 8D</span>
      <span id="dl-status" style="font-size: 12px; color: #5eead4; margin-left: 8px;">
        ${autoDownload ? 'Descargando documento PDF tamaño Carta automáticamente...' : 'Formato Carta (Letter 8.5" × 11") listo para descarga'}
      </span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="downloadPdfNow()" style="background: #0d9488; color: #ffffff; border: none; padding: 7px 16px; border-radius: 3px; font-weight: bold; font-size: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;">
        ⬇ Descargar PDF Carta
      </button>
      <button onclick="window.print()" style="background: #334155; color: #ffffff; border: none; padding: 7px 16px; border-radius: 3px; font-weight: bold; font-size: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;">
        🖨 Imprimir / Guardar
      </button>
    </div>
  </div>

  <div id="report-document">

    <!-- ======================================================== -->
    <!-- HOJA 1 (TAMAÑO CARTA): RESUMEN EJECUTIVO & METODOLOGÍA 8D -->
    <!-- ======================================================== -->
    <div class="page-sheet">

      <!-- TOP HEADER CON LOGO OFICIAL DE LOS TRES DIAMANTES -->
      <div class="top-header">
        <div class="brand-cell">
          <div class="logo-badge">
            <!-- Logo Oficial Mitsubishi Three Diamonds (SVG Puro) -->
            <svg viewBox="0 0 100 95" width="28" height="26">
              <polygon points="50,10 65,36 50,62 35,36" fill="#dc2626"/>
              <polygon points="50,62 80,62 95,88 65,88" fill="#dc2626"/>
              <polygon points="50,62 35,88 5,88 20,62" fill="#dc2626"/>
            </svg>
          </div>
          <div class="corp-name">
            <div class="corp-title">MITSUBISHI MOTORS // QUALITY HUB</div>
            <div class="corp-subtitle">INFORME OFICIAL DE RESOLUCIÓN 8D & CONTROL DE CALIDAD</div>
          </div>
        </div>
        <div class="meta-cell">
          <div><strong style="color: #64748b; font-size: 8px;">FOLIO OFICIAL:</strong> <span style="font-weight: 800; font-size: 11px; color: #0f172a;">${incidente.id}</span></div>
          <div style="margin-top: 2px;">
            <span class="badge-pill" style="background-color: ${severidadColor.bg}; color: ${severidadColor.text}; border: 1px solid ${severidadColor.border};">
              Severidad: ${incidente.severidad}
            </span>
            <span class="badge-pill" style="background-color: ${estadoColor.bg}; color: ${estadoColor.text}; border: 1px solid ${estadoColor.border};">
              ${incidente.estado}
            </span>
          </div>
        </div>
      </div>

      <!-- METADATOS RÁPIDOS DE PLANTA -->
      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Estación / Línea</div>
          <div class="meta-value">${incidente.area}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Fecha y Hora de Detección</div>
          <div class="meta-value">${new Date(incidente.creadoEn).toLocaleString('es-MX')}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Auditor Responsable</div>
          <div class="meta-value">${incidente.validadoPor || 'Equipo de Calidad en Planta'}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Código de Trazabilidad</div>
          <div class="meta-value" style="font-family: monospace;">QA-8D-${incidente.id.replace('INC-', '')}-MITSUBISHI</div>
        </div>
      </div>

      <!-- TARJETA DE DEFINICIÓN Y RESUMEN TÉCNICO -->
      <div class="card-modern" style="border-left: 3px solid #dc2626;">
        <div style="display: table; width: 100%;">
          <div style="display: table-cell; width: 68%; vertical-align: top; padding-right: 8px;">
            <div style="font-size: 8px; font-weight: 800; color: #dc2626; text-transform: uppercase;">Definición del Problema (5W2H)</div>
            <div style="font-size: 10px; font-weight: 700; color: #0f172a; margin-top: 1px;">${analisis?.titulo || incidente.descripcion}</div>
            <div style="font-size: 8.5px; color: #334155; margin-top: 3px; line-height: 1.35;">${analisis?.resumen || incidente.descripcion}</div>
          </div>
          <div style="display: table-cell; width: 32%; vertical-align: top; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 3px; padding: 6px;">
            <div style="font-size: 7.5px; font-weight: 800; color: #991b1b; text-transform: uppercase;">★ Causa Raíz Diagnosticada</div>
            <div style="font-size: 8.5px; font-weight: 700; color: #7f1d1d; margin-top: 2px; line-height: 1.25;">
              ${incidente.causaRaiz}
            </div>
          </div>
        </div>
      </div>

      <!-- MATRIZ DE LAS 8 DISCIPLINAS (8D) -->
      <div class="section-banner">METODOLOGÍA 8D (EIGHT DISCIPLINES) — RESOLUCIÓN SISTÉMICA</div>
      <div class="grid-8d">
        <!-- FILA 1: D1 a D4 -->
        <div class="row-8d">
          <div class="col-8d">
            <span class="d-badge">D1 • EQUIPO</span>
            <div class="d-title">Formación Multidisciplinaria</div>
            <div class="d-text">${d?.d1_equipo?.join(', ') || 'Líder Calidad, Procesos, Mantenimiento'}</div>
          </div>
          <div class="col-8d">
            <span class="d-badge">D2 • DEFINICIÓN</span>
            <div class="d-title">Descripción Detallada</div>
            <div class="d-text">${d?.d2_descripcion || incidente.descripcion}</div>
          </div>
          <div class="col-8d">
            <span class="d-badge">D3 • CONTENCIÓN</span>
            <div class="d-title">Acciones Inmediatas</div>
            <div class="d-text">${d?.d3_contencion || 'Contención en línea y segregación de lote'}</div>
          </div>
          <div class="col-8d root-highlight">
            <span class="d-badge">D4 • CAUSA RAÍZ</span>
            <div class="d-title" style="color: #991b1b;">Análisis Causal Verificado</div>
            <div class="d-text" style="color: #7f1d1d; font-weight: 600;">${d?.d4_causaRaiz || incidente.causaRaiz}</div>
          </div>
        </div>

        <!-- FILA 2: D5 a D8 -->
        <div class="row-8d">
          <div class="col-8d">
            <span class="d-badge">D5 • CORRECTIVAS</span>
            <div class="d-title">Acciones Permanentes</div>
            <div class="d-text">${d?.d5_accionesCorrectivas || 'Ajuste de parámetros y recambio de componentes'}</div>
          </div>
          <div class="col-8d">
            <span class="d-badge">D6 • VALIDACIÓN</span>
            <div class="d-title">Pruebas en Lote Piloto</div>
            <div class="d-text">${d?.d6_implementacion || 'Corrida de verificación sensorial y telemetría'}</div>
          </div>
          <div class="col-8d">
            <span class="d-badge">D7 • PREVENCIÓN</span>
            <div class="d-title">Control de Recurrencia</div>
            <div class="d-text">${d?.d7_prevencion || 'Actualización de AMEF y Poka-Yoke sensorial'}</div>
          </div>
          <div class="col-8d">
            <span class="d-badge">D8 • CIERRE</span>
            <div class="d-title">Lección Aprendida</div>
            <div class="d-text">${d?.d8_cierre || 'Reconocimiento y estandarización compartida'}</div>
          </div>
        </div>
      </div>

      ${evidencias.length > 0 ? `
      <!-- EVIDENCIAS Y TELEMETRÍA IOT -->
      <div class="section-banner">EVIDENCIA TÉCNICA Y TELEMETRÍA IOT ASOCIADA (RESPALDADA_POR)</div>
      <table class="table-modern">
        <thead>
          <tr>
            <th style="width: 25%;">Parámetro / Sensor</th>
            <th>Descripción de la Señal</th>
            <th style="width: 35%;">Valor Registrado</th>
          </tr>
        </thead>
        <tbody>
          ${evidencias.map(e => `
            <tr>
              <td><strong>${e.tipo}</strong></td>
              <td>${e.descripcion}</td>
              <td><code style="font-weight: 700; color: #0284c7;">${e.valor || 'OK'}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ` : ''}

      <div style="text-align: right; font-size: 7.5px; color: #94a3b8; margin-top: 6px;">
        Página 1 de 2 • Mitsubishi Motors Quality Hub • Reporte Tamaño Carta
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- HOJA 2 (TAMAÑO CARTA): DIAGRAMA ISHIKAWA, 5 PORQUÉS Y PLAN DE MITIGACIÓN -->
    <!-- ========================================================================= -->
    <div class="page-sheet page-break">

      <!-- ENCABEZADO DE SEGUNDA HOJA -->
      <div class="top-header" style="padding-bottom: 5px; margin-bottom: 8px;">
        <div class="brand-cell">
          <div class="logo-badge">
            <svg viewBox="0 0 100 95" width="22" height="20">
              <polygon points="50,10 65,36 50,62 35,36" fill="#dc2626"/>
              <polygon points="50,62 80,62 95,88 65,88" fill="#dc2626"/>
              <polygon points="50,62 35,88 5,88 20,62" fill="#dc2626"/>
            </svg>
          </div>
          <div class="corp-name">
            <div class="corp-title" style="font-size: 11px;">MITSUBISHI MOTORS // DIAGNÓSTICO PROFUNDO & MITIGACIÓN</div>
            <div class="corp-subtitle" style="font-size: 7.5px;">ANÁLISIS CAUSAL (ISHIKAWA 6M & 5 PORQUÉS) • FOLIO ${incidente.id}</div>
          </div>
        </div>
        <div class="meta-cell">
          <span class="badge-pill" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1;">Hoja de Ingeniería 2/2</span>
        </div>
      </div>

      <!-- DIAGRAMA VISUAL DE ISHIKAWA (ESPINA DE PESCADO) -->
      <div class="section-banner">DIAGRAMA DE ISHIKAWA (ESPINA DE PESCADO — 6M INDUSTRIAL)</div>
      <div style="margin-bottom: 6px; width: 100%; text-align: center;">
        ${renderFishboneSvgForLetter(ishikawa, incidente.descripcion)}
      </div>

      <!-- CADENA DE 5 PORQUÉS EN LÍNEA -->
      <div class="section-banner">CADENA SECUENCIAL DE LOS 5 PORQUÉS (CONDUCE_A MEMGRAPH)</div>
      <div class="grid-whys">
        ${whys.map(w => `
          <div class="col-why ${w.nivel === 5 ? 'final-root' : ''}">
            <div class="why-header">PASO ${w.nivel} • POR QUÉ ${w.nivel} ${w.nivel === 5 ? '★ RAÍZ' : ''}</div>
            <div class="why-q">${w.pregunta}</div>
            <div class="why-a">→ ${w.respuesta}</div>
          </div>
        `).join('')}
      </div>

      <!-- PLAN DE ACCIONES MITIGADORAS (D3, D5, D7) -->
      <div class="section-banner">PLAN DE ACCIONES MITIGADORAS Y PREVENTIVAS (MITIGADA_POR)</div>
      <table class="table-modern">
        <thead>
          <tr>
            <th style="width: 10%;">Fase</th>
            <th style="width: 18%;">Tipo de Medida</th>
            <th>Descripción de la Acción Operativa</th>
            <th style="width: 25%;">Responsable</th>
            <th style="width: 15%; text-align: center;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${acciones.map(a => `
            <tr>
              <td><strong style="color: #0f766e;">${a.disciplina}</strong></td>
              <td><strong>${a.tipo}</strong></td>
              <td>${a.descripcion}</td>
              <td>${a.responsable}</td>
              <td style="text-align: center;">
                <span class="badge-pill" style="background: ${a.estado === 'Completada' ? '#dcfce7' : a.estado === 'En Proceso' ? '#fef3c7' : '#f1f5f9'}; color: ${a.estado === 'Completada' ? '#166534' : a.estado === 'En Proceso' ? '#92400e' : '#475569'}; border: 1px solid ${a.estado === 'Completada' ? '#86efac' : a.estado === 'En Proceso' ? '#fcd34d' : '#cbd5e1'};">
                  ${a.estado}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- CERTIFICACIÓN Y VALIDACIÓN DEL AUDITOR (HUMANO EN EL BUCLE) -->
      <div class="cert-box">
        <div style="font-size: 8px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">
          CERTIFICACIÓN DE AUDITORÍA DE CALIDAD • HUMANO EN EL BUCLE (HUMAN-IN-THE-LOOP VERIFICATION)
        </div>
        <div style="font-size: 7.5px; color: #475569; margin-bottom: 6px;">
          Notas del Auditor: <em>"${incidente.notasAuditor || 'Causa raíz validada mediante datos de telemetría y pruebas funcionales. Acciones de contención y preventivas aprobadas para ejecución inmediata.'}"</em>
        </div>

        <div class="cert-grid">
          <div class="cert-col">
            <div class="sig-line">
              ${incidente.validadoPor || 'ING. AUDITOR DE CALIDAD RESPONSABLE'}
            </div>
            <div class="sig-meta">Auditor de Calidad en Planta // Mitsubishi Motors</div>
            <div class="sig-meta">Fecha de Validación: ${incidente.fechaValidacion ? new Date(incidente.fechaValidacion).toLocaleDateString('es-MX') : new Date().toLocaleDateString('es-MX')}</div>
          </div>
          <div class="cert-col">
            <div class="sig-line">
              GERENCIA DE INGENIERÍA DE PROCESOS Y MANUFACTURA
            </div>
            <div class="sig-meta">Aprobación Final y Cierre de No Conformidad</div>
            <div class="sig-meta">Sello de Conformidad: QA-MITSUBISHI-8D-VERIFIED</div>
          </div>
        </div>
      </div>

      <div style="display: table; width: 100%; font-size: 7.5px; color: #94a3b8; margin-top: 8px;">
        <div style="display: table-cell;">MITSUBISHI QUALITY ASSURANCE SYSTEM • DOCUMENTO OFICIAL CONTROLADO</div>
        <div style="display: table-cell; text-align: right;">Página 2 de 2 • Tamaño Carta (Letter)</div>
      </div>

    </div>

  </div>

  <script>
    function downloadPdfNow() {
      const status = document.getElementById('dl-status');
      if (status) status.textContent = 'Compilando documento PDF tamaño Carta (Letter 8.5" × 11")...';
      const element = document.getElementById('report-document');
      if (typeof html2pdf !== 'undefined' && element) {
        const opt = {
          margin:       [0.35, 0.45, 0.35, 0.45],
          filename:     'Reporte-8D-${incidente.id}-Carta.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, logging: false },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
          pagebreak:    { mode: ['css', 'legacy'] }
        };
        html2pdf().set(opt).from(element).save().then(() => {
          if (status) status.textContent = '¡PDF tamaño Carta descargado correctamente!';
        }).catch((err) => {
          console.error('[PDF Export]', err);
          if (status) status.textContent = 'Abriendo diálogo de impresión / guardado del navegador...';
          window.print();
        });
      } else {
        window.print();
      }
    }

    ${autoDownload ? `
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(downloadPdfNow, 600);
    });
    ` : ''}
  </script>

</body>
</html>
`;
}
