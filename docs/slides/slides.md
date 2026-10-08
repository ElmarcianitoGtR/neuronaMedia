---
theme: default
title: Reto Mitsubishi - Captura Única y Análisis 8D
info: |
  ## Reto Mitsubishi
  Sistema de Captura Única de Evidencias y Generación Automática de Formatos 8D, Ishikawa y 5 Porqués
  Monitoreo en Vivo y OEE Derivado
class: text-slate-100
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="h-full flex items-center justify-between px-6 pb-12">
  <div class="flex-1 pr-6 text-left">
    <TypeWriter/>
    <h1 class="text-5xl md:text-6xl font-black text-slate-100 tracking-tight mb-6">
      <span class="block text-2xl md:text-3xl font-semibold text-slate-400 mt-4 tracking-normal">
        Para Análisis Causa Raíz (8D) y Monitoreo en Vivo
      </span>
    </h1>
    <div class="flex flex-wrap gap-2 text-xs font-mono text-slate-400 mb-6">
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60"> Reto Mitsubishi</span>
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60"> 8D • Ishikawa • 5 Porqués</span>
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60"> Gatillos IoT & OEE</span>
    </div>
    <div class="text-xs text-slate-400 border-t border-slate-800 pt-3">
      <strong class="text-slate-200">Neurona y Media</strong>
    </div>
  </div>

  <div class="flex flex-col items-center justify-center pl-4">
    <div class="relative flex items-center justify-center">
      <svg class="absolute w-48 h-48 text-slate-600/40 animate-gear-spin pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"></circle>
        <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 8"></circle>
      </svg>
      <div class="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-800 shadow-2xl">
        <div class="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-slate-800 flex items-center justify-center">
          <img src="/logo_color.jpg" alt="Logo" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
    <div class="mt-4 text-center">
      <div class="text-xs font-semibold text-white">Facultad de Informática</div>
      <div class="text-[11px] text-slate-400 font-mono">UAQ</div>
    </div>
  </div>
</div>


<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="right" width="58%" height="160px" scale="1.7" />
</div>

---
transition: slide-left
---

# El Problema: Captura Redundante y Retraso en Análisis 8D

<p class="text-slate-400 text-sm mb-3">La captura manual de fallas dispersa evidencias y demora días la resolución de causa raíz:</p>

<div class="grid grid-cols-5 gap-3.5 items-start">
  <div class="col-span-3 space-y-2">
    <div class="grid grid-cols-2 gap-2">
      <div class="card-clean p-2.5 border-l-4 border-l-rose-500/80">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-rose-500/10 text-rose-300">01</span>
          <h3 class="text-xs font-bold text-white">Gatillos Desconectados</h3>
        </div>
        <p class="text-[11px] text-slate-300 leading-tight">Fallas en máquina o molde detienen la línea sin detonar una toma digital de evidencia.</p>
      </div>
      <div class="card-clean p-2.5 border-l-4 border-l-amber-500/80">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-amber-500/10 text-amber-300">02</span>
          <h3 class="text-xs font-bold text-white">Scrap sin Evidencia</h3>
        </div>
        <p class="text-[11px] text-slate-300 leading-tight">Piezas con defecto se acumulan en merma sin vincular fotos, lote ni variables al instante.</p>
      </div>
      <div class="card-clean p-2.5 border-l-4 border-l-slate-400">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-slate-700 text-slate-300">03</span>
          <h3 class="text-xs font-bold text-white">Captura Redundante</h3>
        </div>
        <p class="text-[11px] text-slate-300 leading-tight">Operadores rellenan múltiples formatos en papel y hojas de cálculo para un mismo defecto.</p>
      </div>
      <div class="card-clean p-2.5 border-l-4 border-l-cyan-500/80">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-300">04</span>
          <h3 class="text-xs font-bold text-white">Análisis 8D Tardío</h3>
        </div>
        <p class="text-[11px] text-slate-300 leading-tight">Los formatos 8D, Ishikawa y 5 Porqués se llenan días después con datos incompletos.</p>
      </div>
    </div>
  </div>
  <div class="col-span-2">
    <InjectionMachine3D></InjectionMachine3D>
  </div>
</div>

---
transition: slide-left
---

# La Solución: Captura Única y Ecosistema Integrado

<div class="text-slate-400 text-sm mb-4">
Plataforma integral donde cada incidente se registra una sola vez para nutrir la gestión de calidad y control visual:
</div>

<div class="grid grid-cols-3 gap-4">
  <div class="card-clean p-4 flex flex-col justify-between">
    <div>
      <div class="w-7 h-7 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3 font-mono">01</div>
      <h3 class="text-sm font-bold text-white mb-2">Gatillos en Piso (Esclavos)</h3>
      <p class="text-xs text-slate-300 leading-relaxed">
        Sensores en máquina/molde y botoneras detectan paros y scrap, disparando inmediatamente el flujo de captura de evidencia.
      </p>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
      Falla Molde • Scrap • Andon
    </div>
  </div>

  <div class="card-clean p-4 flex flex-col justify-between">
    <div>
      <div class="w-7 h-7 rounded-md bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs mb-3 font-mono">02</div>
      <h3 class="text-sm font-bold text-white mb-2">Captura Única (8D)</h3>
      <p class="text-xs text-slate-300 leading-relaxed">
        Un solo punto de ingreso digital donde el operador sube fotos y variables; alimenta automáticamente los formatos 8D, Ishikawa y 5 Porqués.
      </p>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-300">
      Captura Única • 8D • Ishikawa
    </div>
  </div>

  <div class="card-clean p-4 flex flex-col justify-between">
    <div>
      <div class="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-3 font-mono">03</div>
      <h3 class="text-sm font-bold text-white mb-2">Monitoreo Derivado & OEE</h3>
      <p class="text-xs text-slate-300 leading-relaxed">
        Dashboard de control derivado que proyecta en Smart TVs el estado Andon en vivo, Kanban de soporte y cálculo continuo de OEE.
      </p>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-300">
      Control Derivado • OEE • Andon
    </div>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="right" width="58%" height="160px" scale="1.7" />
</div>

---
transition: slide-left
---

# Arquitectura General: Captura Única y Alimentación Automática

<div class="text-slate-400 text-sm mb-2">
Ecosistema digital: las alertas en piso gatillan la captura única y alimentan 8D, Ishikawa y OEE en tiempo real:
</div>

<ArchitectureFlow height="255px"></ArchitectureFlow>

<div class="grid grid-cols-2 gap-4 mt-1 text-xs">
  <div class="card-clean p-2.5 text-slate-300">
    <strong class="text-cyan-400">Gatillo y Captura Única:</strong> La alerta en máquina/molde abre la captura digital en piso; la evidencia se ingresa una sola vez y alimenta automáticamente 8D, Ishikawa y 5 Porqués.
  </div>
  <div class="card-clean p-2.5 text-slate-300">
    <strong class="text-emerald-400">Control Derivado y OEE:</strong> A partir de las evidencias y eventos capturados, el sistema proyecta en vivo el monitoreo Andon y calcula el OEE sin recapturas manuales.
  </div>
</div>


---
transition: slide-left
layout: default
class: final-slide-clean relative overflow-hidden
---

<div class="grid grid-cols-2 gap-6 h-[460px] items-stretch relative z-10 px-6 py-2">
  <!-- Columna Izquierda: Glass Panel con toda la información -->
  <div class="card-clean p-6 flex flex-col justify-between h-full bg-slate-900/70 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl relative overflow-hidden text-left">
    <div class="flex items-center justify-between text-xs font-mono text-cyan-400">
      <span class="flex items-center gap-2 font-bold tracking-wide">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        MVP
      </span>
    </div>
    <div>
      <h1 class="text-3xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">
        Captura única, calidad inmediata, <span class="text-emerald-400">cero recapturas</span>.
      </h1>
      <p class="text-slate-300 text-xs leading-relaxed">
        Integrando gatillos en piso con la generación automática de formatos 8D, Ishikawa y control visual en tiempo real.
      </p>
    </div>
    <div class="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-200">
      <div class="flex items-center gap-2.5">
        <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
        <span>Captura digital única de evidencias y contexto de falla</span>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
        <span>Alimentación automática de formatos 8D, Ishikawa y 5 Porqués</span>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
        <span>Gatillos IoT y dashboards OEE derivados</span>
      </div>
    </div>
    <div class="flex items-center justify-between pt-1 text-xs">
    </div>
  </div>

  <!-- Columna Derecha: Modelo 3D con paquetes ascendentes -->
  <div class="h-full w-full relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 shadow-2xl">
    <div class="absolute top-3 right-4 z-10 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80 pointer-events-none">
      <span></span>
    </div>
    <Paquetes3D></Paquetes3D>
  </div>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.final-slide-clean,
.slidev-layout.final-slide-clean {
  background-image: none !important;
  background: #0b0f17 !important;
  background-color: #0b0f17 !important;
}

.slidev-layout {
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  color: #e2e8f0;
  background-color: #0b0f17 !important;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(100, 116, 139, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(100, 116, 139, 0.08) 0%, transparent 40%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg stroke='%2364748b' stroke-width='0.8' fill='none' stroke-linecap='round' stroke-linejoin='round' opacity='0.22'%3E%3Cpath d='M0 30 h35 l15 15 h30 l10 -10 h30'/%3E%3Ccircle cx='50' cy='45' r='2' fill='%2364748b'/%3E%3Ccircle cx='90' cy='35' r='2' fill='%2364748b'/%3E%3Cpath d='M30 120 v-30 l15 -15 v-25'/%3E%3Ccircle cx='45' cy='75' r='2' fill='%2364748b'/%3E%3Cpath d='M120 90 h-30 l-15 -15 h-20'/%3E%3Ccircle cx='75' cy='75' r='2' fill='%2364748b'/%3E%3Cpath d='M80 0 v20 l-10 10'/%3E%3Cpath d='M10 90 h20'/%3E%3Ccircle cx='30' cy='90' r='1.8' fill='%2364748b'/%3E%3C/g%3E%3Cg fill='%2364748b' opacity='0.16'%3E%3Cpath d='M105 102 a8 8 0 1 0 0.01 0 m-1.5 2.5 a5.5 5.5 0 1 1 -0.01 0'/%3E%3Cpath d='M104 93 h2 v3 h-2 z M104 108 h2 v3 h-2 z M96 101 v2 h3 v-2 z M111 101 v2 h3 v-2 z M98 96 l1.5 1.5 l2 -2 l-1.5 -1.5 z M108 106 l1.5 1.5 l2 -2 l-1.5 -1.5 z M98 108 l1.5 -1.5 l2 2 l-1.5 1.5 z M108 98 l1.5 -1.5 l2 2 l-1.5 1.5 z'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: auto, auto, 120px 120px;
}

h1, h2, h3, h4 {
  font-family: 'Inter', sans-serif !important;
  letter-spacing: -0.025em;
}

code, pre, .font-mono {
  font-family: 'JetBrains Mono', monospace !important;
}

.card-clean {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(100, 116, 139, 0.35);
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
  animation: slideContentEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), 
              border-color 0.22s ease, 
              box-shadow 0.22s ease;
  will-change: transform;
}

.card-clean:hover {
  transform: translateY(-2.5px);
  border-color: rgba(56, 189, 248, 0.55);
  box-shadow: 0 8px 22px -3px rgba(2, 132, 199, 0.15);
}

/* Micro-animación suave en números de métricas */
.card-clean .text-3xl {
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}

.card-clean:hover .text-3xl {
  transform: scale(1.05);
}

/* ============================================================ */
/* ANIMACIONES INTERNAS SIMPLES (SIN SATURAR)                   */
/* ============================================================ */
@keyframes slideContentEnter {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slidev-layout h1,
.slidev-layout h2 {
  animation: slideContentEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.slidev-layout p,
.slidev-layout > div.text-slate-400 {
  animation: slideContentEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.04s both;
}

/* Escalonamiento sutil (Stagger de milisegundos) */
.grid > .card-clean:nth-child(1) { animation-delay: 0.04s; }
.grid > .card-clean:nth-child(2) { animation-delay: 0.08s; }
.grid > .card-clean:nth-child(3) { animation-delay: 0.12s; }
.grid > .card-clean:nth-child(4) { animation-delay: 0.16s; }

.space-y-2\.5 > .card-clean:nth-child(1) { animation-delay: 0.04s; }
.space-y-2\.5 > .card-clean:nth-child(2) { animation-delay: 0.08s; }
.space-y-2\.5 > .card-clean:nth-child(3) { animation-delay: 0.12s; }
.space-y-2\.5 > .card-clean:nth-child(4) { animation-delay: 0.16s; }
.space-y-2\.5 > .card-clean:nth-child(5) { animation-delay: 0.20s; }

/* ============================================================ */
/* TRANSICIONES ENTRE PANTALLAS (SUAVES Y MINIMALISTAS)         */
/* ============================================================ */
.slidev-page-enter-active,
.slidev-page-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
}

.slide-left-enter-from {
  opacity: 0 !important;
  transform: translateX(32px) !important;
}

.slide-left-leave-to {
  opacity: 0 !important;
  transform: translateX(-32px) !important;
}

.slide-right-enter-from {
  opacity: 0 !important;
  transform: translateX(-32px) !important;
}

.slide-right-leave-to {
  opacity: 0 !important;
  transform: translateX(32px) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease !important;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-gear-spin {
  animation: spinSlow 30s linear infinite;
}

/* ============================================================ */
/* ANIMACIÓN LÁSER EN LÍNEAS                                    */
/* ============================================================ */
.mermaid svg .edgePaths path,
.mermaid svg .edgePath path,
.mermaid svg .flowchart-link,
.mermaid svg path[class*="edge"] {
  stroke: #38bdf8 !important;
  stroke-width: 2.5px !important;
  stroke-dasharray: 8 6 !important;
  animation: laserFlow 0.9s linear infinite !important;
  filter: drop-shadow(0 0 4px #06b6d4) drop-shadow(0 0 8px rgba(56, 189, 248, 0.7)) !important;
}

@keyframes laserFlow {
  from {
    stroke-dashoffset: 28;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Puntas de flecha brillantes estilo láser */
.mermaid svg marker path,
.mermaid svg .arrowMarkerPath,
.mermaid svg .arrowheadPath {
  fill: #38bdf8 !important;
  stroke: #38bdf8 !important;
  filter: drop-shadow(0 0 5px #06b6d4) !important;
}

/* Etiquetas en las flechas (ej. WebSockets) */
.mermaid svg .edgeLabel {
  background-color: #0b0f17 !important;
  color: #38bdf8 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 11px !important;
  border-radius: 4px !important;
  padding: 2px 6px !important;
  border: 1px solid rgba(56, 189, 248, 0.3) !important;
}
.mermaid svg .edgeLabel rect {
  fill: #0b0f17 !important;
  opacity: 0.9 !important;
}

/* Estilo de nodos de Mermaid */
.mermaid svg .node rect,
.mermaid svg .node polygon,
.mermaid svg .node circle {
  fill: rgba(15, 23, 42, 0.9) !important;
  stroke: #475569 !important;
  stroke-width: 1.5px !important;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4)) !important;
}
.mermaid svg .node:hover rect {
  stroke: #38bdf8 !important;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.4)) !important;
}
.mermaid svg .node .label {
  color: #f1f5f9 !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
}

/* Contenedores de grupos (Subgraphs) */
.mermaid svg .cluster rect {
  fill: rgba(15, 23, 42, 0.45) !important;
  stroke: rgba(100, 116, 139, 0.4) !important;
  stroke-width: 1.2px !important;
  rx: 8px !important;
}
.mermaid svg .cluster .nodeLabel {
  color: #94a3b8 !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 700 !important;
  font-size: 12px !important;
}
</style>
