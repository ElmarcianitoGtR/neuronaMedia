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

<!-- ========================================== -->
<!-- SLIDE 1: PORTADA CON MARCO CIRCULAR PARA FOTO -->
<!-- ========================================== -->

<div class="h-full flex items-center justify-between px-6 pb-12">
  <div class="flex-1 pr-6 text-left">
    <h2 class="text-lg font-medium text-slate-300 mb-6">
      Sistema Digital de Captura Única para Análisis Causa Raíz (8D) y Monitoreo en Vivo
    </h2>
    <div class="flex flex-wrap gap-2 text-xs font-mono text-slate-400 mb-6">
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60"> Reto Mitsubishi</span>
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60"> 8D • Ishikawa • 5 Porqués</span>
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60"> Gatillos IoT & OEE</span>
    </div>
    <div class="text-xs text-slate-400 border-t border-slate-800 pt-3">
      Presentado por: <strong class="text-slate-200">Neurona y Media</strong>
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
          <img src="/Propuesta_.jpg" alt="Logo" class="w-full h-full object-cover">
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
transition: fade-out
---

# El Problema: Captura Redundante y Retraso en Análisis 8D

<p class="text-slate-400 text-sm mb-3">La captura manual de fallas en inyección dispersa evidencias y demora días la resolución de causa raíz:</p>

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
    <div class="p-2 rounded-lg bg-slate-900/90 border border-slate-700/60 text-[11px] text-slate-300 flex items-center justify-between">
      <span class="font-semibold text-rose-400">Consecuencia:</span>
      <span>Evidencias perdidas • Días de retraso en reportes 8D • Recaptura manual</span>
    </div>
  </div>
  <div class="col-span-2">
    <InjectionMachine3D></InjectionMachine3D>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="left" width="58%" height="160px" scale="1.7"></CircuitGearsAnimation>
</div>

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

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="left" width="58%" height="160px" scale="1.7" />
</div>

---

# Capa de Adquisición: Esclavos y Contingencia

<div class="grid grid-cols-2 gap-5 h-[75%] items-start">
  <div class="card-clean p-4">
    <div class="flex items-center gap-2 mb-3">
      <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
      <h3 class="text-xs font-bold text-white tracking-wide uppercase font-mono">Telemetría Automática</h3>
    </div>
    <ul class="text-xs text-slate-300 space-y-3">
      <li class="flex items-start gap-2">
        <span class="text-cyan-400 font-bold">✔</span>
        <span><strong>Sensores de Conteo:</strong> Sensores fotoeléctricos o inductivos registrando piezas producidas en tiempo real.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-cyan-400 font-bold">✔</span>
        <span><strong>Monitoreo de Estado:</strong> Detección de paros mediante lectura de señales eléctricas de maquinaria.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-cyan-400 font-bold">✔</span>
        <span><strong>Básculas de Scrap:</strong> Sensores de pesaje dedicados en contenedores de rechazo para cuantificar merma.</span>
      </li>
    </ul>
  </div>

  <div class="card-clean p-4">
    <div class="flex items-center gap-2 mb-3">
      <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
      <h3 class="text-xs font-bold text-white tracking-wide uppercase font-mono">Reporte Ágil & Contingencia</h3>
    </div>
    <ul class="text-xs text-slate-300 space-y-3">
      <li class="flex items-start gap-2">
        <span class="text-amber-400 font-bold">●</span>
        <span><strong>Botonera Andon Física:</strong> 3 botones de acceso directo: <span class="text-rose-400 font-semibold">Falla</span>, <span class="text-amber-400 font-semibold">Calidad</span>, <span class="text-cyan-400 font-semibold">Materiales</span>.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-amber-400 font-bold">●</span>
        <span><strong>HMI Simplificada:</strong> Pantallas táctiles de dos toques para operadores en estaciones críticas.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-amber-400 font-bold">●</span>
        <span><strong>Escaneo QR Móvil (Respaldo):</strong> Contingencia manual inmediata desde celular en caso de daño en sensores físicos.</span>
      </li>
    </ul>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="right" width="58%" height="160px" scale="1.7" />
</div>

---

# Plataforma Web: Control Visual Integral

<div class="text-slate-400 text-sm mb-3">
Tres interfaces diseñadas para cada nivel operativo de la empresa:
</div>

<div class="grid grid-cols-3 gap-4">
  <div class="card-clean p-4">
    <div class="text-[11px] font-mono text-rose-400 font-semibold mb-1">PISO DE PLANTA</div>
    <h3 class="text-sm font-bold text-white mb-2">Tablero Andon Digital</h3>
    <p class="text-[11px] text-slate-300 mb-3 leading-relaxed">
      Proyectado en Smart TVs sobre las líneas con codificación universal de colores:
    </p>
    <div class="space-y-1.5 text-[10px] font-mono">
      <div class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex justify-between">
        <span>VERDE</span><span>Producción Normal</span>
      </div>
      <div class="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex justify-between">
        <span>AMARILLO</span><span>Alerta / Calidad</span>
      </div>
      <div class="px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 flex justify-between">
        <span>ROJO</span><span>Paro de Línea</span>
      </div>
    </div>
  </div>

  <div class="card-clean p-4">
    <div class="text-[11px] font-mono text-cyan-400 font-semibold mb-1">SUPERVISIÓN</div>
    <h3 class="text-sm font-bold text-white mb-2">Dashboard de OEE</h3>
    <p class="text-[11px] text-slate-300 mb-3 leading-relaxed">
      Métricas consolidadas para líderes de turno y control de operaciones:
    </p>
    <ul class="text-[11px] text-slate-300 space-y-1.5">
      <li>• <strong>OEE Calculado en Vivo</strong> (Disponibilidad / Calidad).</li>
      <li>• <strong>Piezas Meta vs. Real</strong> con indicador de avance.</li>
      <li>• <strong>Tasa de Scrap</strong> en tiempo real por lote.</li>
      <li>• <strong>Historial de Tiempos Muertos</strong> auditables.</li>
    </ul>
  </div>

  <div class="card-clean p-4">
    <div class="text-[11px] font-mono text-slate-300 font-semibold mb-1">MANTENIMIENTO</div>
    <h3 class="text-sm font-bold text-white mb-2">Kanban de Soporte</h3>
    <p class="text-[11px] text-slate-300 mb-3 leading-relaxed">
      Gestión rápida de incidencias para reducir los tiempos medios de reparación:
    </p>
    <ul class="text-[11px] text-slate-300 space-y-1.5">
      <li>• <strong>Alertas Nuevas:</strong> Disparadas por sensor o botón.</li>
      <li>• <strong>En Atención:</strong> Técnico asignado con temporizador.</li>
      <li>• <strong>Resueltas:</strong> Registro de solución y refacciones.</li>
    </ul>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="left" width="58%" height="160px" scale="1.7" />
</div>

---

# Stack Tecnológico y Comunicaciones

<div class="grid grid-cols-2 gap-4 mt-2">
  <div class="card-clean p-4">
    <div class="text-cyan-400 text-xs font-mono font-semibold mb-1">COMUNICACIÓN INDUSTRIAL</div>
    <h3 class="text-sm font-bold text-white mb-2">MQTT + OPC UA + WebSockets</h3>
    <p class="text-xs text-slate-300 leading-relaxed">
      • <strong>MQTT (Eclipse Mosquitto):</strong> Transmisión pub/sub de bajo consumo de ancho de banda.<br>
      • <strong>OPC UA:</strong> Enlace nativo con PLCs industriales y simulación MVP en MATLAB.<br>
      • <strong>WebSockets:</strong> Difusión inmediata hacia los navegadores web.
    </p>
  </div>

  <div class="card-clean p-4">
    <div class="text-emerald-400 text-xs font-mono font-semibold mb-1">ALMACENAMIENTO DE DATOS</div>
    <h3 class="text-sm font-bold text-white mb-2">InfluxDB + PostgreSQL</h3>
    <p class="text-xs text-slate-300 leading-relaxed">
      • <strong>InfluxDB (Time-Series):</strong> Almacena millones de lecturas de sensores por segundo con compresión avanzada.<br>
      • <strong>PostgreSQL (Relacional):</strong> Gestión de usuarios, turnos, catálogo de fallas y trazabilidad.
    </p>
  </div>

  <div class="card-clean p-4">
    <div class="text-amber-400 text-xs font-mono font-semibold mb-1">PROCESAMIENTO CENTRAL</div>
    <h3 class="text-sm font-bold text-white mb-2">Servidor Maestro (API)</h3>
    <p class="text-xs text-slate-300 leading-relaxed">
      Motor de cálculo en Node.js / Python para métricas en vivo (OEE, MTTR, scrap) y distribución de eventos a los clientes web.
    </p>
  </div>

  <div class="card-clean p-4">
    <div class="text-slate-300 text-xs font-mono font-semibold mb-1">FRONTEND & PRESENTACIÓN</div>
    <h3 class="text-sm font-bold text-white mb-2">Vue 3 + Slidev + UnoCSS</h3>
    <p class="text-xs text-slate-300 leading-relaxed">
      Interfaces reactivas fluidas, paneles modulares y presentación técnica con tipografía minimalista y soporte de animaciones.
    </p>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="right" width="58%" height="160px" scale="1.7" />
</div>

---

# Flujo Operativo: Del Gatillo al Formato 8D

<div class="text-slate-400 text-sm mb-4">
Secuencia integrada: el gatillo en piso inicia la captura única y genera los reportes de calidad:
</div>

<div class="space-y-2.5">
  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-rose-500">
    <span class="font-mono text-rose-400 font-bold text-xs w-16">0.0 seg</span>
    <div class="text-xs">
      <strong class="text-white">Gatillo de Incidencia:</strong> Sensor detecta paro en molde o scrap y dispara la alerta operativa en piso.
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-amber-500">
    <span class="font-mono text-amber-400 font-bold text-xs w-16">0.2 seg</span>
    <div class="text-xs">
      <strong class="text-white">Apertura de Captura Digital:</strong> La terminal en estación abre la interfaz guiada de ingreso de evidencia.
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-cyan-500">
    <span class="font-mono text-cyan-400 font-bold text-xs w-16">0.5 seg</span>
    <div class="text-xs">
      <strong class="text-white">Captura Única en Piso:</strong> Operador adjunta fotos, causa preliminar y variables una sola vez en el sistema.
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-slate-400">
    <span class="font-mono text-slate-300 font-bold text-xs w-16">1.5 seg</span>
    <div class="text-xs">
      <strong class="text-white">Alimentación Automática 8D:</strong> El motor estructura el evento al instante en formatos 8D, Ishikawa y 5 Porqués.
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-emerald-500">
    <span class="font-mono text-emerald-400 font-bold text-xs w-16">Cierre</span>
    <div class="text-xs">
      <strong class="text-white">Control Derivado y OEE:</strong> El tablero Andon reanuda en verde y el OEE se recalcula sin recaptura manual.
    </div>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="left" width="58%" height="160px" scale="1.7" />
</div>

---

# Impacto y Resultados de Negocio (ROI)

<div class="text-slate-400 text-sm mb-4">
Mejoras cuantificables proyectadas en piso de producción:
</div>

<div class="grid grid-cols-4 gap-4">
  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-rose-400 mb-1">-75%</div>
    <div class="text-xs font-bold text-white mb-1">Tiempo en Reportes 8D</div>
    <div class="text-[10px] text-slate-400 leading-tight">Generación instantánea de 8D e Ishikawa eliminando papeleo manual</div>
  </div>

  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-emerald-400 mb-1">+15%</div>
    <div class="text-xs font-bold text-white mb-1">Incremento en OEE</div>
    <div class="text-[10px] text-slate-400 leading-tight">Resolución acelerada de paros de máquina con acciones correctivas inmediatas</div>
  </div>

  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-amber-400 mb-1">-25%</div>
    <div class="text-xs font-bold text-white mb-1">Reducción de Scrap</div>
    <div class="text-[10px] text-slate-400 leading-tight">Identificación de causa raíz con 5 Porqués antes de producir merma en lote</div>
  </div>

  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-cyan-400 mb-1">100%</div>
    <div class="text-xs font-bold text-white mb-1">Captura Única Digital</div>
    <div class="text-[10px] text-slate-400 leading-tight">Cero recapturas de información y trazabilidad auditable de punta a punta</div>
  </div>
</div>

<div class="mt-5 card-clean p-3.5 flex items-center justify-between">
  <div>
    <div class="text-xs font-bold text-white">Retorno de Inversión (ROI) Estimado</div>
    <div class="text-[11px] text-slate-400">Implementación modular progresiva sin frenar la línea de manufactura activa.</div>
  </div>
  <div class="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs font-bold">
    Amortización &lt; 3 meses
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none">
  <CircuitGearsAnimation side="right" width="58%" height="160px" scale="1.7" />
</div>

---
layout: end
class: text-center
---

<div class="h-full flex flex-col justify-center items-center pb-12">

  <h1 class="text-4xl font-extrabold text-white mb-3">
    Captura Única. Calidad Inmediata. Cero Recapturas.
  </h1>

  <p class="text-slate-300 text-sm max-w-lg mb-8">
    Integrando gatillos en piso con la generación automática de 8D, Ishikawa y control visual en tiempo real.
  </p>

  <div class="card-clean p-4 max-w-md w-full text-left">
    <div class="text-xs font-mono text-cyan-400 mb-1">ESTADO DEL MVP:</div>
    <div class="text-xs text-slate-300 mb-3 space-y-1">
      <div>✔ Captura digital única de evidencias y contexto de falla</div>
      <div>✔ Alimentación automática de formatos 8D, Ishikawa y 5 Porqués</div>
      <div>✔ Gatillos IoT en máquina/molde y dashboards OEE derivados</div>
    </div>
    <div class="text-center font-bold text-sm text-white pt-2 border-t border-slate-800">
      ¿Preguntas o comentarios?
    </div>
  </div>
</div>


<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

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
}

.card-clean:hover {
  border-color: rgba(148, 163, 184, 0.6);
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-gear-spin {
  animation: spinSlow 30s linear infinite;
}

/* ============================================================ */
/* ANIMACIÓN LÁSER EN LÍNEAS Y FLECHAS DE MERMAID               */
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
