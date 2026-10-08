---
theme: default
title: NeuronaMedia - Control Visual y Monitoreo de Producción
info: |
  ## NeuronaMedia
  Sistema de Control Visual y Monitoreo de Producción en Tiempo Real
  Arquitectura Master-Slave e Industria 4.0
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
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600/50 text-slate-300 text-xs font-mono tracking-wider mb-4">
      <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
      ARQUITECTURA MASTER-SLAVE • IOT
    </div>
    <h1 class="text-4xl font-extrabold text-white leading-tight mb-2">
      Neurona<span class="text-cyan-400">Media</span>
    </h1>
    <h2 class="text-lg font-medium text-slate-300 mb-6">
      Sistema de Control Visual y Monitoreo de Producción en Tiempo Real
    </h2>
    <div class="flex flex-wrap gap-2 text-xs font-mono text-slate-400 mb-6">
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">⚙️ Sensores IoT</span>
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">⚡ Protocolo MQTT</span>
      <span class="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">📊 Andon Digital</span>
    </div>
    <div class="text-xs text-slate-400 border-t border-slate-800 pt-3">
      Presentado por: <strong class="text-slate-200">Equipo de Desarrollo NeuronaMedia</strong>
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
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Foto del Presentador" class="w-full h-full object-cover">
        </div>
        <div class="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-lg" title="En línea">
          <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
        </div>
      </div>
    </div>
    <div class="mt-4 text-center">
      <div class="text-xs font-semibold text-white">Ponente / Equipo</div>
      <div class="text-[11px] text-slate-400 font-mono">Líder de Proyecto</div>
    </div>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-40">
  <CircuitGearsAnimation height="55px" />
</div>

---
transition: fade-out
---

# El Problema: Ceguera Operativa en Planta

<div class="text-slate-400 text-sm mb-4">
Las líneas de producción sufren demoras críticas por falta de información instantánea:
</div>

<div class="grid grid-cols-2 gap-4">
  <div class="card-clean p-4 border-l-4 border-l-rose-500/80">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300">01</span>
      <h3 class="text-sm font-bold text-white">Paros No Detectados a Tiempo</h3>
    </div>
    <p class="text-xs text-slate-300 leading-relaxed">
      Fallas mecánicas o atascos pasan inadvertidos por minutos hasta que el operador busca físicamente al personal de mantenimiento.
    </p>
  </div>

  <div class="card-clean p-4 border-l-4 border-l-amber-500/80">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">02</span>
      <h3 class="text-sm font-bold text-white">Scrap Silencioso</h3>
    </div>
    <p class="text-xs text-slate-300 leading-relaxed">
      Piezas defectuosas se acumulan sin registro oportuno. Las mermas se descubren al final del turno, impidiendo correcciones inmediatas.
    </p>
  </div>

  <div class="card-clean p-4 border-l-4 border-l-slate-400">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">03</span>
      <h3 class="text-sm font-bold text-white">Bitácoras Manuales y Papel</h3>
    </div>
    <p class="text-xs text-slate-300 leading-relaxed">
      Datos capturados a mano propensos a errores, información desfasada y nula trazabilidad histórica de causa raíz.
    </p>
  </div>

  <div class="card-clean p-4 border-l-4 border-l-cyan-500/80">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">04</span>
      <h3 class="text-sm font-bold text-white">Respuesta Descoordinada</h3>
    </div>
    <p class="text-xs text-slate-300 leading-relaxed">
      Sin un canal visual centralizado, mantenimiento y control de calidad no tienen orden de prioridad ni métricas de tiempo de atención.
    </p>
  </div>
</div>

<div class="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
  <span class="font-semibold text-rose-400">Consecuencia:</span>
  <span>Baja disponibilidad de maquinaria • Costos por merma • Incumplimiento de metas OEE</span>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-30">
  <CircuitGearsAnimation height="50px" />
</div>

---

# La Solución: Ecosistema 360° en Tiempo Real

<div class="text-slate-400 text-sm mb-4">
Integración continua de extremo a extremo: del sensor en máquina a la pantalla del supervisor.
</div>

<div class="grid grid-cols-3 gap-4">
  <div class="card-clean p-4 flex flex-col justify-between">
    <div>
      <div class="w-7 h-7 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3 font-mono">01</div>
      <h3 class="text-sm font-bold text-white mb-2">Captura en Piso (Esclavos)</h3>
      <p class="text-xs text-slate-300 leading-relaxed">
        Hardware en cada estación: sensores de conteo, detección de paro y botoneras Andon manuales para reporte ágil.
      </p>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
      ESP32 • Sensores I/O • HMI
    </div>
  </div>

  <div class="card-clean p-4 flex flex-col justify-between">
    <div>
      <div class="w-7 h-7 rounded-md bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs mb-3 font-mono">02</div>
      <h3 class="text-sm font-bold text-white mb-2">Canalización Inmediata</h3>
      <p class="text-xs text-slate-300 leading-relaxed">
        Protocolos industriales ultraligeros de suscripción/publicación que transfieren telemetría con latencia inferior a 100 ms.
      </p>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-300">
      Broker MQTT • WebSockets
    </div>
  </div>

  <div class="card-clean p-4 flex flex-col justify-between">
    <div>
      <div class="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-3 font-mono">03</div>
      <h3 class="text-sm font-bold text-white mb-2">Control Visual Activo</h3>
      <p class="text-xs text-slate-300 leading-relaxed">
        Tableros Andon digitales proyectados en planta, dashboards de OEE y panel Kanban para resolución cronometrada de tickets.
      </p>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-300">
      Andon Digital • Kanban • OEE
    </div>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-35">
  <CircuitGearsAnimation height="50px" />
</div>

---

# Arquitectura General: Master-Slave

<div class="text-slate-400 text-sm mb-2">
Diseño desacoplado y resiliente para la continuidad operativa de la planta:
</div>

```mermaid
graph LR
    subgraph S1["1. Esclavos (Línea)"]
        S[Sensores: Conteo / Scrap]
        B[Botoneras Andon / HMI]
        MVP[Simulador OPC UA]
    end

    subgraph S2["2. Red / Comunicación"]
        MQTT{Broker MQTT / OPC UA}
    end

    subgraph S3["3. Maestro (Servidor)"]
        Node[Backend Node / Python API]
        DB[(InfluxDB + PostgreSQL)]
    end

    subgraph S4["4. Control Visual"]
        Andon[Tablero Andon Digital]
        Dash[Dashboard de OEE]
        Kanban[Kanban de Soporte]
    end

    S --> MQTT
    B --> MQTT
    MVP --> Node
    MQTT --> Node
    Node <--> DB
    Node == WebSockets ==> Andon
    Node == WebSockets ==> Dash
    Node == WebSockets ==> Kanban
```

<div class="grid grid-cols-2 gap-4 mt-2 text-xs">
  <div class="card-clean p-2.5 text-slate-300">
    <strong class="text-cyan-400">Resiliencia Local:</strong> Cada esclavo sigue operando de forma autónoma aunque exista una interrupción temporal en la red.
  </div>
  <div class="card-clean p-2.5 text-slate-300">
    <strong class="text-emerald-400">Actualización en Vivo:</strong> WebSockets distribuyen el estado de las máquinas a todas las pantallas de planta simultáneamente.
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-30">
  <CircuitGearsAnimation height="45px" />
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

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-35">
  <CircuitGearsAnimation height="50px" />
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

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-30">
  <CircuitGearsAnimation height="50px" />
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

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-30">
  <CircuitGearsAnimation height="50px" />
</div>

---

# Flujo Operativo: De la Falla a la Solución

<div class="text-slate-400 text-sm mb-4">
Secuencia cronometrada de respuesta ante una contingencia en planta:
</div>

<div class="space-y-2.5">
  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-rose-500">
    <span class="font-mono text-rose-400 font-bold text-xs w-16">0.0 seg</span>
    <div class="text-xs">
      <strong class="text-white">Detección de Incidencia:</strong> Sensor detecta paro o el operador presiona la <span class="text-rose-400 font-semibold">Botonera Andon</span>.
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-amber-500">
    <span class="font-mono text-amber-400 font-bold text-xs w-16">0.2 seg</span>
    <div class="text-xs">
      <strong class="text-white">Publicación MQTT:</strong> El esclavo envía el payload JSON al broker local maestro (<code class="text-cyan-300">planta/linea-1/alerta</code>).
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-cyan-500">
    <span class="font-mono text-cyan-400 font-bold text-xs w-16">0.5 seg</span>
    <div class="text-xs">
      <strong class="text-white">Alerta en Pantalla Andon:</strong> El backend emite vía WebSockets. La TV de la nave parpadea en rojo y se crea ticket en Kanban.
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-slate-400">
    <span class="font-mono text-slate-300 font-bold text-xs w-16">1.5 seg</span>
    <div class="text-xs">
      <strong class="text-white">Asignación de Técnico:</strong> Mantenimiento toma el ticket desde su dispositivo; el estado cambia a "En Atención".
    </div>
  </div>

  <div class="card-clean p-3 flex items-center gap-4 border-l-4 border-l-emerald-500">
    <span class="font-mono text-emerald-400 font-bold text-xs w-16">Cierre</span>
    <div class="text-xs">
      <strong class="text-white">Reanudación y Auditoría:</strong> Línea reanuda en <span class="text-emerald-400 font-semibold">Verde</span> y el tiempo de paro queda registrado para el OEE.
    </div>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-30">
  <CircuitGearsAnimation height="50px" />
</div>

---

# Impacto y Resultados de Negocio (ROI)

<div class="text-slate-400 text-sm mb-4">
Mejoras cuantificables proyectadas en piso de producción:
</div>

<div class="grid grid-cols-4 gap-4">
  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-rose-400 mb-1">-40%</div>
    <div class="text-xs font-bold text-white mb-1">Tiempo de Respuesta</div>
    <div class="text-[10px] text-slate-400 leading-tight">Reducción del MTTR al eliminar demoras en aviso de mantenimiento</div>
  </div>

  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-emerald-400 mb-1">+15%</div>
    <div class="text-xs font-bold text-white mb-1">Incremento en OEE</div>
    <div class="text-[10px] text-slate-400 leading-tight">Mayor disponibilidad de máquinas al resolver micro-paros</div>
  </div>

  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-amber-400 mb-1">-25%</div>
    <div class="text-xs font-bold text-white mb-1">Reducción de Scrap</div>
    <div class="text-[10px] text-slate-400 leading-tight">Detección temprana de piezas defectuosas antes de lotes mayores</div>
  </div>

  <div class="card-clean p-4 text-center">
    <div class="text-3xl font-extrabold text-cyan-400 mb-1">100%</div>
    <div class="text-xs font-bold text-white mb-1">Trazabilidad Digital</div>
    <div class="text-[10px] text-slate-400 leading-tight">Auditoría continua de turnos sin depender de bitácoras manuales</div>
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

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-30">
  <CircuitGearsAnimation height="50px" />
</div>

---
layout: end
class: text-center
---

<div class="h-full flex flex-col justify-center items-center pb-12">
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-mono mb-4">
    NEURONAMEDIA • INDUSTRIA 4.0
  </div>

  <h1 class="text-4xl font-extrabold text-white mb-3">
    Control Visual. Respuesta Rápida. Cero Paros Ciegos.
  </h1>

  <p class="text-slate-300 text-sm max-w-lg mb-8">
    Conectando la telemetría en piso con la toma de decisiones inmediata.
  </p>

  <div class="card-clean p-4 max-w-md w-full text-left">
    <div class="text-xs font-mono text-cyan-400 mb-1">ESTADO DEL MVP:</div>
    <div class="text-xs text-slate-300 mb-3 space-y-1">
      <div>✔ Arquitectura Master-Slave funcional</div>
      <div>✔ Integración MQTT, OPC UA y WebSockets</div>
      <div>✔ Tableros Andon y telemetría en tiempo real</div>
    </div>
    <div class="text-center font-bold text-sm text-white pt-2 border-t border-slate-800">
      ¿Preguntas o comentarios?
    </div>
  </div>
</div>

<div class="absolute bottom-0 left-0 right-0 px-4 pointer-events-none opacity-40">
  <CircuitGearsAnimation height="55px" />
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
</style>
