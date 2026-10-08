const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'quality-hub/src/components/IshikawaDiagram.astro');
let content = fs.readFileSync(filePath, 'utf8');

// Update categories
content = content.replace(
  /const topCategories = \[[\s\S]*?\];/,
  `const topCategories = [
  { key: 'Maquinaria', label: 'MAQUINARIA', xTip: 250, xSpine: 400, labelX: 140, labelY: 50 },
  { key: 'Método', label: 'MÉTODO', xTip: 550, xSpine: 700, labelX: 440, labelY: 50 },
  { key: 'Mano de Obra', label: 'MANO DE OBRA', xTip: 850, xSpine: 1000, labelX: 740, labelY: 50 }
];`
);

content = content.replace(
  /const bottomCategories = \[[\s\S]*?\];/,
  `const bottomCategories = [
  { key: 'Materiales', label: 'MATERIALES', xTip: 250, xSpine: 400, labelX: 140, labelY: 650 },
  { key: 'Medición', label: 'MEDICIÓN', xTip: 550, xSpine: 700, labelX: 440, labelY: 650 },
  { key: 'Medio Ambiente', label: 'MEDIO AMBIENTE', xTip: 850, xSpine: 1000, labelX: 740, labelY: 650 }
];`
);

// Update SVG viewBox
content = content.replace(/viewBox="0 0 1140 560"/, 'viewBox="0 0 1400 700"');

// Update spine
content = content.replace(/x1="40"\s+y1="280"\s+x2="910"\s+y2="280"/, 'x1="40"\n          y1="350"\n          x2="1060"\n          y2="350"');

// Update Head
content = content.replace(/<g transform="translate\(930, 215\)">/, '<g transform="translate(1080, 240)">');
content = content.replace(/width="190"\s+height="130"/, 'width="280"\n            height="220"');
content = content.replace(/width="190" height="26"/, 'width="280" height="45"');
content = content.replace(/x="95" y="17" fill="#fca5a5" font-size="11"/, 'x="140" y="30" fill="#fca5a5" font-size="18"');
content = content.replace(/<foreignObject x="10" y="32" width="170" height="90">/, '<foreignObject x="10" y="55" width="260" height="150">');
content = content.replace(/class="text-\[11px\] text-slate-200 font-sans leading-tight pt-1"/, 'class="text-[16px] text-slate-200 font-sans leading-tight pt-1"');

// Update Top Ribs inside map
content = content.replace(
  /width="140"\s+height="28"/g,
  'width="220"\n                height="45"'
);
content = content.replace(/y={cat.labelY - 20}/g, 'y={cat.labelY - 30}');
content = content.replace(/x={cat.labelX \+ 70}\s+y={cat.labelY - 2}\s+fill="#2dd4bf"\s+font-size="11"/g, 'x={cat.labelX + 110}\n                y={cat.labelY}\n                fill="#2dd4bf"\n                font-size="18"');

// Top costilla diagonal
content = content.replace(/y1={cat.labelY \+ 8}\s+x2={cat.xSpine}\s+y2="280"/g, 'y1={cat.labelY + 15}\n                x2={cat.xSpine}\n                y2="350"');

// Top Factors
content = content.replace(/const branchY = 50 \+ ratio \* 200;/, 'const branchY = 80 + ratio * 270;');
content = content.replace(/const subLineLength = 110;/, 'const subLineLength = 150;');

// Update Bottom Ribs Badge
content = content.replace(/y={cat.labelY - 10}/g, 'y={cat.labelY - 15}');
content = content.replace(/x={cat.labelX \+ 70}\s+y={cat.labelY \+ 8}\s+fill="#2dd4bf"\s+font-size="11"/g, 'x={cat.labelX + 110}\n                y={cat.labelY + 15}\n                fill="#2dd4bf"\n                font-size="18"');

// Bottom costilla diagonal
content = content.replace(/y1={cat.labelY - 10}\s+x2={cat.xSpine}\s+y2="280"/g, 'y1={cat.labelY - 15}\n                x2={cat.xSpine}\n                y2="350"');

// Bottom Factors
content = content.replace(/const branchY = 510 - ratio \* 200;/, 'const branchY = 620 - ratio * 270;');

// Update rect inside Factors mapping (both top and bottom are generated dynamically so we just regex replace)
content = content.replace(/x={branchEndX - 105}\s+y={branchY - 14}\s+width="105"\s+height="28"/g, 'x={branchEndX - 230}\n                      y={branchY - 20}\n                      width="230"\n                      height="40"');

content = content.replace(/x={branchEndX - 52}\s+y={branchY \+ 3}\s+fill={textColor}\s+font-size="9.5"/g, 'x={branchEndX - 115}\n                      y={branchY + 6}\n                      fill={textColor}\n                      font-size="16"');

content = content.replace(/\{fact.factor.length > 15 \? fact.factor.substring\(0, 14\) \+ '…' : fact.factor\}/g, "{fact.factor.length > 25 ? fact.factor.substring(0, 24) + '…' : fact.factor}");

// Update Root CAUSA indicator
content = content.replace(/transform={\`translate\\\(\\\$\{branchEndX - 105\}, \\\$\{branchY - 24\}\\\)\`}/g, "transform={`translate(${branchEndX - 230}, ${branchY - 34})`}");
content = content.replace(/transform={\`translate\\\(\\\$\{branchEndX - 105\}, \\\$\{branchY \+ 18\}\\\)\`}/g, "transform={`translate(${branchEndX - 230}, ${branchY + 22})`}");
content = content.replace(/<rect width="52" height="12" rx="1" fill="#ef4444" \/>/g, '<rect width="90" height="18" rx="2" fill="#ef4444" />');
content = content.replace(/<text x="26" y="9" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">/g, '<text x="45" y="13" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated astro");
