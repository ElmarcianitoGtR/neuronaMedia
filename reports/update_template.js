const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'quality-hub/src/lib/pdf/template.ts');
let content = fs.readFileSync(filePath, 'utf8');

const oldFunc = content.match(/function renderFishboneSvgForLetter[\s\S]*?return svg;\n\}/)[0];

const newFunc = `function renderFishboneSvgForLetter(ishikawa: IshikawaFactor[], problema: string): string {
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

  let svg = \`
  <svg viewBox="0 0 1400 700" style="width: 100%; height: auto; margin: 0 auto; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
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
        \${problemLines.map((line, idx) => \`<tspan x="20" dy="\${idx === 0 ? 0 : 26}">\${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</tspan>\`).join('')}
      </text>
    </g>
  \`;

  // Costillas Superiores
  topCats.forEach(cat => {
    const factors = getFactors(cat.key);
    svg += \`
      <!-- Categoría Superior -->
      <rect x="\${cat.labelX}" y="\${cat.labelY - 30}" width="220" height="45" rx="6" fill="#0f766e" />
      <text x="\${cat.labelX + 110}" y="\${cat.labelY}" fill="#ffffff" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="1">\${cat.label}</text>
      <line x1="\${cat.xTip}" y1="\${cat.labelY + 15}" x2="\${cat.xSpine}" y2="350" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
    \`;

    factors.forEach((f, idx) => {
      const ratio = (idx + 1) / (factors.length + 1);
      const branchY = 80 + ratio * 270;
      const branchXOnRib = cat.xTip + ratio * (cat.xSpine - cat.xTip);
      const lineLen = 40;
      const boxWidth = 230;
      const boxHeight = 40;
      const startX = branchXOnRib - lineLen;
      const isRoot = f.esCausaRaiz;

      svg += \`
        <line x1="\${startX}" y1="\${branchY}" x2="\${branchXOnRib}" y2="\${branchY}" stroke="\${isRoot ? '#dc2626' : '#94a3b8'}" stroke-width="3" marker-end="url(#fishbone-subarrow)" />
        <rect x="\${startX - boxWidth}" y="\${branchY - boxHeight/2}" width="\${boxWidth}" height="\${boxHeight}" rx="4" fill="\${isRoot ? '#fee2e2' : '#ffffff'}" stroke="\${isRoot ? '#dc2626' : '#cbd5e1'}" stroke-width="\${isRoot ? '3' : '2'}" />
        <text x="\${startX - boxWidth/2}" y="\${branchY + 6}" fill="\${isRoot ? '#991b1b' : '#0f172a'}" font-size="16" font-weight="\${isRoot ? '700' : '600'}" text-anchor="middle">
          \${f.factor.length > 25 ? f.factor.substring(0, 24) + '…' : f.factor}
        </text>
      \`;
    });
  });

  // Costillas Inferiores
  bottomCats.forEach(cat => {
    const factors = getFactors(cat.key);
    svg += \`
      <!-- Categoría Inferior -->
      <rect x="\${cat.labelX}" y="\${cat.labelY - 15}" width="220" height="45" rx="6" fill="#0f766e" />
      <text x="\${cat.labelX + 110}" y="\${cat.labelY + 15}" fill="#ffffff" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="1">\${cat.label}</text>
      <line x1="\${cat.xTip}" y1="\${cat.labelY - 15}" x2="\${cat.xSpine}" y2="350" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
    \`;

    factors.forEach((f, idx) => {
      const ratio = (idx + 1) / (factors.length + 1);
      const branchY = 620 - ratio * 270;
      const branchXOnRib = cat.xTip + ratio * (cat.xSpine - cat.xTip);
      const lineLen = 40;
      const boxWidth = 230;
      const boxHeight = 40;
      const startX = branchXOnRib - lineLen;
      const isRoot = f.esCausaRaiz;

      svg += \`
        <line x1="\${startX}" y1="\${branchY}" x2="\${branchXOnRib}" y2="\${branchY}" stroke="\${isRoot ? '#dc2626' : '#94a3b8'}" stroke-width="3" marker-end="url(#fishbone-subarrow)" />
        <rect x="\${startX - boxWidth}" y="\${branchY - boxHeight/2}" width="\${boxWidth}" height="\${boxHeight}" rx="4" fill="\${isRoot ? '#fee2e2' : '#ffffff'}" stroke="\${isRoot ? '#dc2626' : '#cbd5e1'}" stroke-width="\${isRoot ? '3' : '2'}" />
        <text x="\${startX - boxWidth/2}" y="\${branchY + 6}" fill="\${isRoot ? '#991b1b' : '#0f172a'}" font-size="16" font-weight="\${isRoot ? '700' : '600'}" text-anchor="middle">
          \${f.factor.length > 25 ? f.factor.substring(0, 24) + '…' : f.factor}
        </text>
      \`;
    });
  });

  svg += \`</svg>\`;
  return svg;
}`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated template.ts");
