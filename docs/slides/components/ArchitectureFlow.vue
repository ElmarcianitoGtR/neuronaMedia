<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '260px'
  }
})
</script>

<template>
  <div 
    class="w-full flex items-center justify-center bg-transparent overflow-hidden relative select-none"
    :style="{ height: height, width: width }"
  >
    <svg 
      viewBox="0 0 950 270" 
      class="w-full h-full max-h-full" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Filtro de resplandor láser neón -->
        <filter id="laser-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <!-- Gradientes para fondos de módulos -->
        <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="master-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#0c1e36" stop-opacity="0.95" />
        </linearGradient>

        <!-- Marcador de flecha láser cian -->
        <marker id="laser-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
        </marker>

        <!-- Marcador de flecha láser esmeralda -->
        <marker id="ws-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
        </marker>

        <!-- RUTAS DE CABLES -->
        <path id="wire-s-mqtt" d="M 195 56 C 240 56, 255 125, 290 125" />
        <path id="wire-b-mqtt" d="M 195 125 L 290 125" />
        <path id="wire-mvp-mqtt" d="M 195 194 C 240 194, 255 125, 290 125" />

        <path id="wire-mqtt-node" d="M 410 125 L 485 125" />

        <path id="wire-node-andon" d="M 660 110 C 695 110, 705 56, 735 56" />
        <path id="wire-node-dash" d="M 660 125 L 735 125" />
        <path id="wire-node-kanban" d="M 660 140 C 695 140, 705 194, 735 194" />
      </defs>

      <!-- ============================================== -->
      <!-- 1. CABLES LÁSER ANIMADOS                         -->
      <!-- ============================================== -->

      <!-- Canales base en gris oscuro -->
      <g stroke="#334155" stroke-width="2.5" fill="none" opacity="0.6">
        <use href="#wire-s-mqtt" />
        <use href="#wire-b-mqtt" />
        <use href="#wire-mvp-mqtt" />
        <use href="#wire-mqtt-node" />
        <use href="#wire-node-andon" />
        <use href="#wire-node-dash" />
        <use href="#wire-node-kanban" />
      </g>

      <!-- Líneas láser cian animadas -->
      <g stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="7 7" class="laser-track" marker-end="url(#laser-arrow)">
        <use href="#wire-s-mqtt" />
        <use href="#wire-b-mqtt" />
        <use href="#wire-mvp-mqtt" />
        <use href="#wire-mqtt-node" />
      </g>

      <!-- Líneas láser esmeralda animadas (WebSockets) -->
      <g stroke="#34d399" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="8 6" class="laser-track-fast" marker-end="url(#ws-arrow)">
        <use href="#wire-node-andon" />
        <use href="#wire-node-dash" />
        <use href="#wire-node-kanban" />
      </g>

      <!-- Partículas láser en movimiento físico en tiempo real -->
      <g filter="url(#laser-glow)">
        <circle r="3.2" fill="#ffffff">
          <animateMotion dur="1.2s" repeatCount="indefinite">
            <mpath href="#wire-s-mqtt" />
          </animateMotion>
        </circle>
        <circle r="3.2" fill="#ffffff">
          <animateMotion dur="0.9s" repeatCount="indefinite">
            <mpath href="#wire-b-mqtt" />
          </animateMotion>
        </circle>
        <circle r="3.2" fill="#ffffff">
          <animateMotion dur="1.4s" repeatCount="indefinite">
            <mpath href="#wire-mvp-mqtt" />
          </animateMotion>
        </circle>
        <circle r="3.8" fill="#ffffff">
          <animateMotion dur="0.75s" repeatCount="indefinite">
            <mpath href="#wire-mqtt-node" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="#a7f3d0">
          <animateMotion dur="1.1s" repeatCount="indefinite">
            <mpath href="#wire-node-andon" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="#a7f3d0">
          <animateMotion dur="0.85s" repeatCount="indefinite">
            <mpath href="#wire-node-dash" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="#a7f3d0">
          <animateMotion dur="1.1s" repeatCount="indefinite">
            <mpath href="#wire-node-kanban" />
          </animateMotion>
        </circle>
      </g>

      <!-- ============================================== -->
      <!-- 2. CONTENEDORES Y TEXTOS CENTRADOS PROTEGIDOS   -->
      <!-- ============================================== -->

      <!-- GRUPO 1: ESCLAVOS -->
      <g>
        <rect x="15" y="15" width="185" height="235" rx="10" fill="url(#card-grad)" stroke="#475569" stroke-width="1.2" stroke-dasharray="4 3" />
        <text x="107" y="34" class="t-title" style="font-size: 10px !important;">1. ESCLAVOS (PLANTA)</text>

        <!-- Sensores -->
        <rect x="25" y="40" width="165" height="32" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" />
        <text x="107" y="56" class="t-node" style="font-size: 10px !important;">Sensores: Conteo / Scrap</text>

        <!-- Botoneras -->
        <rect x="25" y="109" width="165" height="32" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2" />
        <text x="107" y="125" class="t-node" style="font-size: 10px !important;">Botoneras Andon / HMI</text>

        <!-- Simulador -->
        <rect x="25" y="177" width="165" height="34" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="1.2" />
        <text x="107" y="190" class="t-node" style="font-size: 9.5px !important;">Simulador OPC UA</text>
        <text x="107" y="202" class="t-sub" style="font-size: 8px !important;">(Digital Twin / MVP)</text>
      </g>

      <!-- GRUPO 2: RED / BROKER MQTT -->
      <g>
        <rect x="285" y="65" width="130" height="125" rx="12" fill="url(#card-grad)" stroke="#0284c7" stroke-width="1.5" />
        <text x="350" y="85" class="t-header-cyan" style="font-size: 10px !important;">2. RED / COMMS</text>
        
        <circle cx="350" cy="125" r="26" fill="#0b1329" stroke="#38bdf8" stroke-width="1.5" />
        <text x="350" y="122" class="t-header-cyan" style="font-size: 10.5px !important;">MQTT</text>
        <text x="350" y="133" class="t-sub" style="font-size: 7.5px !important;">BROKER</text>
        
        <text x="350" y="172" class="t-sub" style="font-size: 8.5px !important;">OPC UA / TCP</text>
      </g>

      <!-- GRUPO 3: SERVIDOR MAESTRO -->
      <g>
        <rect x="480" y="30" width="185" height="200" rx="10" fill="url(#master-grad)" stroke="#38bdf8" stroke-width="1.4" />
        <text x="572" y="50" class="t-header-cyan" style="font-size: 10px !important;">3. MAESTRO (SERVER)</text>

        <!-- Backend -->
        <rect x="492" y="65" width="161" height="48" rx="6" fill="#0b172a" stroke="#0ea5e9" stroke-width="1.2" />
        <text x="572" y="83" class="t-node" style="font-size: 10px !important;">Backend API Gateway</text>
        <text x="572" y="97" class="t-sub-cyan" style="font-size: 8.5px !important;">Node.js / Python Fast</text>

        <!-- Base de datos -->
        <rect x="492" y="128" width="161" height="48" rx="6" fill="#0b172a" stroke="#10b981" stroke-width="1.2" />
        <text x="572" y="146" class="t-node" style="font-size: 10px !important;">Almacenamiento Dual</text>
        <text x="572" y="160" class="t-sub-green" style="font-size: 8.5px !important;">InfluxDB + PostgreSQL</text>
      </g>

      <!-- GRUPO 4: CONTROL VISUAL -->
      <g>
        <rect x="730" y="15" width="195" height="235" rx="10" fill="url(#card-grad)" stroke="#10b981" stroke-width="1.4" />
        <text x="827" y="34" class="t-header-green" style="font-size: 10px !important;">4. CONTROL VISUAL</text>

        <!-- Andon -->
        <rect x="742" y="40" width="171" height="32" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.2" />
        <circle cx="757" cy="56" r="3.5" fill="#ef4444" />
        <text x="832" y="56" class="t-node" style="font-size: 9.8px !important;">Tablero Andon Digital</text>

        <!-- Dashboard -->
        <rect x="742" y="109" width="171" height="32" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" />
        <circle cx="757" cy="125" r="3.5" fill="#38bdf8" />
        <text x="832" y="125" class="t-node" style="font-size: 9.8px !important;">Dashboard de OEE</text>

        <!-- Kanban -->
        <rect x="742" y="178" width="171" height="32" rx="6" fill="#0f172a" stroke="#a855f7" stroke-width="1.2" />
        <circle cx="757" cy="194" r="3.5" fill="#a855f7" />
        <text x="832" y="194" class="t-node" style="font-size: 9.8px !important;">Kanban de Soporte</text>
      </g>

      <!-- BADGES SOBRE CABLES -->
      <g>
        <rect x="428" y="115" width="46" height="18" rx="4" fill="#0b0f17" stroke="#38bdf8" stroke-width="0.8" />
        <text x="451" y="125" class="t-badge-cyan" style="font-size: 8px !important;">Pub/Sub</text>

        <rect x="670" y="115" width="58" height="18" rx="4" fill="#0b0f17" stroke="#34d399" stroke-width="0.8" />
        <text x="699" y="125" class="t-badge-green" style="font-size: 8px !important;">WebSockets</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
/* Clases de texto con tamaño blindado contra resets de CSS */
svg text {
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  text-anchor: middle !important;
  dominant-baseline: central !important;
  user-select: none;
}

.t-title {
  fill: #94a3b8 !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
}

.t-header-cyan {
  fill: #38bdf8 !important;
  font-weight: 700 !important;
}

.t-header-green {
  fill: #34d399 !important;
  font-weight: 700 !important;
}

.t-node {
  fill: #f8fafc !important;
  font-weight: 600 !important;
}

.t-sub {
  fill: #94a3b8 !important;
  font-family: 'JetBrains Mono', monospace !important;
}

.t-sub-cyan {
  fill: #38bdf8 !important;
  font-family: 'JetBrains Mono', monospace !important;
}

.t-sub-green {
  fill: #34d399 !important;
  font-family: 'JetBrains Mono', monospace !important;
}

.t-badge-cyan {
  fill: #38bdf8 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-weight: 600 !important;
}

.t-badge-green {
  fill: #34d399 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-weight: 600 !important;
}

/* Animación de flujo láser en los cables */
.laser-track {
  animation: laserStream 0.85s linear infinite;
  filter: drop-shadow(0 0 3px #38bdf8) drop-shadow(0 0 6px rgba(56, 189, 248, 0.6));
}

.laser-track-fast {
  animation: laserStream 0.7s linear infinite;
  filter: drop-shadow(0 0 3px #34d399) drop-shadow(0 0 6px rgba(52, 211, 153, 0.6));
}

@keyframes laserStream {
  from {
    stroke-dashoffset: 28;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
