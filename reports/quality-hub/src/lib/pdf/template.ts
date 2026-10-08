import type { Incidencia, IshikawaFactor } from '../types';

function renderFishboneSvgForPdf(ishikawa: IshikawaFactor[], problema: string): string {
  const topCats = [
    { key: 'Maquinaria', label: 'MAQUINARIA', xTip: 140, xSpine: 240, labelX: 80, labelY: 25 },
    { key: 'Método', label: 'MÉTODO', xTip: 320, xSpine: 420, labelX: 270, labelY: 25 },
    { key: 'Mano de Obra', label: 'MANO DE OBRA', xTip: 500, xSpine: 600, labelX: 440, labelY: 25 }
  ];

  const bottomCats = [
    { key: 'Materiales', label: 'MATERIALES', xTip: 140, xSpine: 240, labelX: 80, labelY: 295 },
    { key: 'Medición', label: 'MEDICIÓN', xTip: 320, xSpine: 420, labelX: 265, labelY: 295 },
    { key: 'Medio Ambiente', label: 'MEDIO AMBIENTE', xTip: 500, xSpine: 600, labelX: 435, labelY: 295 }
  ];

  const getFactors = (cat: string) => ishikawa.filter(f => f.categoria.toLowerCase() === cat.toLowerCase());

  let svgContent = `
  <svg viewBox="0 0 850 320" style="width: 100%; height: auto; font-family: Helvetica, Arial, sans-serif;">
    <defs>
      <marker id="pdf-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f766e" />
      </marker>
      <marker id="pdf-subarrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
      </marker>
    </defs>

    <!-- Espina Central -->
    <line x1="30" y1="160" x2="690" y2="160" stroke="#0f766e" stroke-width="3.5" marker-end="url(#pdf-arrow)" />

    <!-- Cabeza (Problema) -->
    <rect x="705" y="115" width="135" height="90" rx="3" fill="#f8fafc" stroke="#dc2626" stroke-width="1.5" />
    <rect x="705" y="115" width="135" height="20" rx="2" fill="#fee2e2" />
    <text x="772" y="129" fill="#991b1b" font-size="8.5" font-weight="bold" text-anchor="middle">EFECTO / DEFECTO</text>
    <foreignObject x="712" y="138" width="121" height="62">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 8px; color: #0f172a; line-height: 1.2; font-weight: bold; padding: 2px;">
        ${problema.length > 80 ? problema.substring(0, 80) + '...' : problema}
      </div>
    </foreignObject>
  `;

  // Costillas superiores
  topCats.forEach(cat => {
    const factors = getFactors(cat.key);
    svgContent += `
      <!-- Categoría -->
      <rect x="${cat.labelX}" y="${cat.labelY - 14}" width="110" height="20" rx="2" fill="#f1f5f9" stroke="#0f766e" stroke-width="1" />
      <text x="${cat.labelX + 55}" y="${cat.labelY}" fill="#0f766e" font-size="8.5" font-weight="bold" text-anchor="middle">${cat.label}</text>
      <line x1="${cat.xTip}" y1="${cat.labelY + 6}" x2="${cat.xSpine}" y2="160" stroke="#94a3b8" stroke-width="2" />
    `;

    factors.forEach((f, idx) => {
      const ratio = (idx + 1) / (factors.length + 1);
      const branchY = 35 + ratio * 115;
      const branchXOnRib = cat.xTip + ratio * (cat.xSpine - cat.xTip);
      const startX = branchXOnRib - 75;
      const isRoot = f.esCausaRaiz;

      svgContent += `
        <line x1="${startX}" y1="${branchY}" x2="${branchXOnRib}" y2="${branchY}" stroke="${isRoot ? '#dc2626' : '#94a3b8'}" stroke-width="1" marker-end="url(#pdf-subarrow)" />
        <rect x="${startX - 75}" y="${branchY - 10}" width="75" height="18" rx="1.5" fill="${isRoot ? '#fee2e2' : '#ffffff'}" stroke="${isRoot ? '#dc2626' : '#cbd5e1'}" stroke-width="${isRoot ? '1.5' : '0.8'}" />
        <text x="${startX - 37}" y="${branchY + 2}" fill="${isRoot ? '#991b1b' : '#1e293b'}" font-size="7.5" font-weight="${isRoot ? 'bold' : 'normal'}" text-anchor="middle">
          ${f.factor.length > 13 ? f.factor.substring(0, 12) + '…' : f.factor}
        </text>
      `;
    });
  });

  // Costillas inferiores
  bottomCats.forEach(cat => {
    const factors = getFactors(cat.key);
    svgContent += `
      <!-- Categoría -->
      <rect x="${cat.labelX}" y="${cat.labelY - 6}" width="110" height="20" rx="2" fill="#f1f5f9" stroke="#0f766e" stroke-width="1" />
      <text x="${cat.labelX + 55}" y="${cat.labelY + 8}" fill="#0f766e" font-size="8.5" font-weight="bold" text-anchor="middle">${cat.label}</text>
      <line x1="${cat.xTip}" y1="${cat.labelY - 6}" x2="${cat.xSpine}" y2="160" stroke="#94a3b8" stroke-width="2" />
    `;

    factors.forEach((f, idx) => {
      const ratio = (idx + 1) / (factors.length + 1);
      const branchY = 285 - ratio * 115;
      const branchXOnRib = cat.xTip + ratio * (cat.xSpine - cat.xTip);
      const startX = branchXOnRib - 75;
      const isRoot = f.esCausaRaiz;

      svgContent += `
        <line x1="${startX}" y1="${branchY}" x2="${branchXOnRib}" y2="${branchY}" stroke="${isRoot ? '#dc2626' : '#94a3b8'}" stroke-width="1" marker-end="url(#pdf-subarrow)" />
        <rect x="${startX - 75}" y="${branchY - 10}" width="75" height="18" rx="1.5" fill="${isRoot ? '#fee2e2' : '#ffffff'}" stroke="${isRoot ? '#dc2626' : '#cbd5e1'}" stroke-width="${isRoot ? '1.5' : '0.8'}" />
        <text x="${startX - 37}" y="${branchY + 2}" fill="${isRoot ? '#991b1b' : '#1e293b'}" font-size="7.5" font-weight="${isRoot ? 'bold' : 'normal'}" text-anchor="middle">
          ${f.factor.length > 13 ? f.factor.substring(0, 12) + '…' : f.factor}
        </text>
      `;
    });
  });

  svgContent += `</svg>`;
  return svgContent;
}

export function renderQualityReportHtml(incidente: Incidencia): string {
  const analisis = incidente.analisis;
  const d = analisis?.disciplinas8d;
  const ishikawa = analisis?.ishikawa || [];
  const whys = analisis?.cincoPorques || [];
  const acciones = analisis?.acciones || [];
  const evidencias = analisis?.evidencias || [];

  const severidadBadgeColor =
    incidente.severidad === 'Crítica'
      ? '#dc2626'
      : incidente.severidad === 'Alta'
      ? '#ea580c'
      : incidente.severidad === 'Media'
      ? '#d97706'
      : '#16a34a';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte 8D - ${incidente.id} - Mitsubishi Quality Challenge</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 12mm 12mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 10.5px;
      line-height: 1.35;
      padding: 5px;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 3px solid #dc2626;
      margin-bottom: 12px;
      padding-bottom: 6px;
    }
    .brand-title {
      font-size: 17px;
      font-weight: 900;
      color: #000000;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 9.5px;
      font-weight: 700;
      color: #dc2626;
      letter-spacing: 0.5px;
    }
    .meta-box {
      text-align: right;
      font-size: 9.5px;
    }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      font-weight: bold;
      color: #ffffff;
      border-radius: 2px;
      text-transform: uppercase;
      font-size: 8.5px;
    }
    .section-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      background: #0f172a;
      color: #ffffff;
      padding: 3px 6px;
      margin-top: 10px;
      margin-bottom: 5px;
      letter-spacing: 0.5px;
    }
    .fishbone-card {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 8px;
      margin-bottom: 8px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 4px 6px;
      text-align: left;
    }
    table.data-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
      font-size: 9px;
      text-transform: uppercase;
    }
    .grid-5 {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 6px;
    }
    .col-five {
      display: table-cell;
      width: 20%;
      vertical-align: top;
      padding-right: 4px;
    }
    .col-five:last-child {
      padding-right: 0;
    }
    .why-step {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 5px;
      height: 100%;
    }
    .why-step.root-cause {
      border: 1.5px solid #dc2626;
      background: #fef2f2;
    }
    .why-num {
      color: #0284c7;
      font-weight: 800;
      font-size: 8.5px;
    }
    .why-step.root-cause .why-num {
      color: #dc2626;
    }
    .signature-area {
      margin-top: 18px;
      display: table;
      width: 100%;
      page-break-inside: avoid;
    }
    .sig-block {
      display: table-cell;
      width: 50%;
      text-align: center;
      padding: 8px 25px;
    }
    .sig-line {
      border-top: 1px solid #475569;
      margin-top: 28px;
      padding-top: 4px;
      font-weight: bold;
      font-size: 9.5px;
    }
    .sig-sub {
      color: #64748b;
      font-size: 8px;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <table class="header-table">
    <tr>
      <td style="vertical-align: middle;">
        <div class="brand-title">MITSUBISHI MOTORS // QUALITY HUB</div>
        <div class="brand-sub">SISTEMA INTEGRAL DE AUDITORÍA Y RESOLUCIÓN 8D / ISHIKAWA / 5 PORQUÉS</div>
      </td>
      <td class="meta-box" style="vertical-align: middle;">
        <div><strong>FOLIO:</strong> ${incidente.id}</div>
        <div><strong>FECHA:</strong> ${new Date(incidente.creadoEn).toLocaleString('es-MX')}</div>
        <div>
          <strong>SEVERIDAD:</strong>
          <span class="badge" style="background-color: ${severidadBadgeColor};">${incidente.severidad}</span>
        </div>
        <div><strong>ESTADO:</strong> ${incidente.estado}</div>
      </td>
    </tr>
  </table>

  <!-- RESUMEN EJECUTIVO & DATOS DE PLANTA -->
  <table class="data-table">
    <tr>
      <th style="width: 20%;">Área / Estación</th>
      <td style="width: 30%; font-weight: bold;">${incidente.area}</td>
      <th style="width: 20%;">Causa Raíz Identificada</th>
      <td style="width: 30%; color: #dc2626; font-weight: bold;">${incidente.causaRaiz}</td>
    </tr>
    <tr>
      <th>Descripción del Problema</th>
      <td colspan="3">${incidente.descripcion}</td>
    </tr>
  </table>

  <!-- 8 DISCIPLINAS (8D) -->
  <div class="section-title">METODOLOGÍA 8D (EIGHT DISCIPLINES)</div>
  <table class="data-table">
    <tr>
      <th style="width: 15%;">D1. Equipo</th>
      <td>${d?.d1_equipo?.join(', ') || 'Equipo Multidisciplinario de Planta'}</td>
    </tr>
    <tr>
      <th>D2. Definición</th>
      <td>${d?.d2_descripcion || incidente.descripcion}</td>
    </tr>
    <tr>
      <th>D3. Contención</th>
      <td>${d?.d3_contencion || 'Acciones de contención inmediata aplicadas'}</td>
    </tr>
    <tr>
      <th>D4. Causa Raíz</th>
      <td style="font-weight: bold; color: #b91c1c;">${d?.d4_causaRaiz || incidente.causaRaiz}</td>
    </tr>
    <tr>
      <th>D5. Correctivas</th>
      <td>${d?.d5_accionesCorrectivas || 'Acciones correctivas permanentes en marcha'}</td>
    </tr>
    <tr>
      <th>D6. Validación</th>
      <td>${d?.d6_implementacion || 'Validación en lote piloto y corrida controlada'}</td>
    </tr>
    <tr>
      <th>D7. Prevención</th>
      <td>${d?.d7_prevencion || 'Actualización de FMEA / AMEF y Poka-Yoke'}</td>
    </tr>
    <tr>
      <th>D8. Cierre</th>
      <td>${d?.d8_cierre || 'Lección de un punto (OPL) compartida con la estación'}</td>
    </tr>
  </table>

  <!-- DIAGRAMA VISUAL DE ISHIKAWA (ESPINA DE PESCADO) -->
  <div class="section-title">DIAGRAMA DE ISHIKAWA (ESPINA DE PESCADO - 6M)</div>
  <div class="fishbone-card">
    ${renderFishboneSvgForPdf(ishikawa, incidente.descripcion)}
  </div>

  <!-- 5 PORQUÉS EN LÍNEA -->
  <div class="section-title">CADENA SECUENCIAL DE LOS 5 PORQUÉS</div>
  <div class="grid-5">
    ${whys.map(w => `
      <div class="col-five">
        <div class="why-step ${w.nivel === 5 ? 'root-cause' : ''}">
          <div class="why-num">POR QUÉ #${w.nivel}</div>
          <div style="font-size: 8.5px; font-weight: bold; margin-top: 2px;">${w.pregunta}</div>
          <div style="font-size: 8px; color: #475569; margin-top: 3px;">→ ${w.respuesta}</div>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- PLAN DE ACCIONES DE MITIGACIÓN -->
  <div class="section-title">PLAN DE ACCIONES MITIGADORAS (D3, D5, D7)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 10%;">Fase</th>
        <th style="width: 15%;">Tipo</th>
        <th>Descripción de la Acción</th>
        <th style="width: 25%;">Responsable</th>
        <th style="width: 12%;">Estado</th>
      </tr>
    </thead>
    <tbody>
      ${acciones.map(a => `
        <tr>
          <td><strong>${a.disciplina}</strong></td>
          <td>${a.tipo}</td>
          <td>${a.descripcion}</td>
          <td>${a.responsable}</td>
          <td><span style="font-weight: bold; color: ${a.estado === 'Completada' ? '#16a34a' : a.estado === 'En Proceso' ? '#d97706' : '#64748b'};">${a.estado}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- FIRMAS Y VALIDACIÓN AUDITOR (HUMANO EN EL BUCLE) -->
  <div class="signature-area">
    <div class="sig-block">
      <div class="sig-line">
        ${incidente.validadoPor || 'AUDITOR DE CALIDAD RESPONSABLE'}
      </div>
      <div class="sig-sub">Validación Humana en el Bucle // Mitsubishi Motors Planta</div>
      <div class="sig-sub">Fecha de Aprobación: ${incidente.fechaValidacion || new Date().toISOString().split('T')[0]}</div>
    </div>
    <div class="sig-block">
      <div class="sig-line">
        GERENCIA DE MANUFACTURA Y PROCESOS
      </div>
      <div class="sig-sub">Aprobación de Cierre y Verificación de Mitigación</div>
      <div class="sig-sub">Código de Conformidad: QA-MITSUBISHI-PASS</div>
    </div>
  </div>

</body>
</html>
`;
}
