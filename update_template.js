const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reports/quality-hub/src/lib/pdf/template.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Add import
content = content.replace(
  "export function renderQualityReportHtml(",
  "import { logoColorB64, logoBnB64 } from '../logos';\n\nexport function renderQualityReportHtml("
);

// Replace "Mitsubishi" mentions
content = content.replace(/MITSUBISHI MOTORS \/\/ QUALITY HUB/g, 'NEURONA Y MEDIA // QUALITY HUB');
content = content.replace(/MITSUBISHI MOTORS \/\/ DIAGNÓSTICO PROFUNDO/g, 'NEURONA Y MEDIA // DIAGNÓSTICO PROFUNDO');
content = content.replace(/Mitsubishi Motors Quality Challenge/g, 'Neurona y Media Quality Challenge');
content = content.replace(/Mitsubishi Motors Quality Hub/g, 'Neurona y Media Quality Hub');
content = content.replace(/MITSUBISHI QUALITY ASSURANCE/g, 'NEURONA Y MEDIA QUALITY ASSURANCE');
content = content.replace(/QA-MITSUBISHI-8D-VERIFIED/g, 'QA-NEURONAYMEDIA-8D-VERIFIED');
content = content.replace(/QA-8D-\$\{incidente\.id\.replace\('INC-', ''\)\}-MITSUBISHI/g, 'QA-8D-${incidente.id.replace(\'INC-\', \'\')}-NEURONAYMEDIA');
content = content.replace(/Mitsubishi Motors/g, 'Neurona y Media');

// Add watermark CSS
content = content.replace(
  /\/\* ENCABEZADO CORPORATIVO MITSUBISHI \*\//g,
  `/* MARCA DE AGUA */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      opacity: 0.05;
      z-index: 0;
      pointer-events: none;
    }
    .content-front {
      position: relative;
      z-index: 10;
    }
    /* ENCABEZADO CORPORATIVO */`
);

// Add watermark image inside page-sheet
content = content.replace(
  /<div class="page-sheet">/g,
  `<div class="page-sheet">
      <img src="\${logoBnB64}" class="watermark" />
      <div class="content-front">`
);

content = content.replace(
  /<div class="page-sheet page-break">/g,
  `<div class="page-sheet page-break">
      <img src="\${logoBnB64}" class="watermark" />
      <div class="content-front">`
);

// Close the content-front div
content = content.replace(
  /<div style="text-align: right; font-size: 7\.5px; color: #94a3b8; margin-top: 6px;">/g,
  `</div>
      <div style="text-align: right; font-size: 7.5px; color: #94a3b8; margin-top: 6px; position:relative; z-index:10;">`
);

content = content.replace(
  /<div style="display: table; width: 100%; font-size: 7\.5px; color: #94a3b8; margin-top: 8px;">/g,
  `</div>
      <div style="display: table; width: 100%; font-size: 7.5px; color: #94a3b8; margin-top: 8px; position:relative; z-index:10;">`
);

// Replace SVG logos with image tag
const oldSvgStr1 = `<svg viewBox="0 0 100 95" width="28" height="26">
              <polygon points="50,10 65,36 50,62 35,36" fill="#dc2626"/>
              <polygon points="50,62 80,62 95,88 65,88" fill="#dc2626"/>
              <polygon points="50,62 35,88 5,88 20,62" fill="#dc2626"/>
            </svg>`;

const oldSvgStr2 = `<svg viewBox="0 0 100 95" width="22" height="20">
              <polygon points="50,10 65,36 50,62 35,36" fill="#dc2626"/>
              <polygon points="50,62 80,62 95,88 65,88" fill="#dc2626"/>
              <polygon points="50,62 35,88 5,88 20,62" fill="#dc2626"/>
            </svg>`;

content = content.replace(oldSvgStr1, `<img src="\${logoColorB64}" style="width: 32px; height: auto;" />`);
content = content.replace(oldSvgStr2, `<img src="\${logoColorB64}" style="width: 26px; height: auto;" />`);


fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated template.ts");
