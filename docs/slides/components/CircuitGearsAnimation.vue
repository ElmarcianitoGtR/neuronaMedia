<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '240px'
  },
  side: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  },
  scale: {
    type: Number,
    default: 1.25
  },
  // Tono gris carbón por defecto
  strokeColor: {
    type: String,
    default: '#475569'
  },
  accentColor: {
    type: String,
    default: '#334155'
  }
})

const svgRef = ref(null)
const gear1Ref = ref(null)
const gear2Ref = ref(null)
let mainTimeline = null
let gearTween1 = null
let gearTween2 = null

onMounted(() => {
  if (!svgRef.value) return

  // 1. Configurar animación de trazado de líneas (DrawSVG nativo con GSAP)
  const circuitPaths = svgRef.value.querySelectorAll('.circuit-trace')
  const circuitNodes = svgRef.value.querySelectorAll('.circuit-node')

  circuitPaths.forEach((path) => {
    const length = path.getTotalLength()
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0.85
    })
  })

  gsap.set(circuitNodes, {
    scale: 0,
    transformOrigin: 'center center',
    opacity: 0
  })

  // 2. Rotación continua de engranajes minimalistas
  gearTween1 = gsap.to(gear1Ref.value, {
    rotation: 360,
    transformOrigin: '50% 50%',
    repeat: -1,
    ease: 'none',
    duration: 24
  })

  gearTween2 = gsap.to(gear2Ref.value, {
    rotation: -360,
    transformOrigin: '50% 50%',
    repeat: -1,
    ease: 'none',
    duration: 16
  })

  // 3. Timeline de trazado fluido en bucle
  mainTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

  mainTimeline
    // Trazado de las líneas principales
    .to(circuitPaths, {
      strokeDashoffset: 0,
      duration: 3,
      stagger: 0.25,
      ease: 'power2.inOut'
    })
    // Aparición fluida de los nodos terminales
    .to(
      circuitNodes,
      {
        scale: 1,
        opacity: 0.9,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(2)'
      },
      '-=1.2'
    )
    // Sutil respiración / pulso de energía
    .to(circuitPaths, {
      opacity: 0.4,
      duration: 1.2,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    })
    // Reversión / desvanecimiento suave para reiniciar el ciclo
    .to(
      circuitNodes,
      {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power1.in'
      },
      '+=1'
    )
    .to(
      circuitPaths,
      {
        strokeDashoffset: (i, el) => -el.getTotalLength(),
        duration: 1.8,
        stagger: 0.15,
        ease: 'power2.in'
      },
      '-=0.2'
    )
    .set(circuitPaths, {
      strokeDashoffset: (i, el) => el.getTotalLength()
    })
})

onBeforeUnmount(() => {
  if (mainTimeline) mainTimeline.kill()
  if (gearTween1) gearTween1.kill()
  if (gearTween2) gearTween2.kill()
})
</script>

<template>
  <div
    class="circuit-gear-bg"
    :class="[`circuit-gear-bg--${side}`]"
    :style="{
      height: height,
      width: width,
      opacity: 0.42,
      '--gear-scale': scale
    }"
  >
    <svg
      ref="svgRef"
      viewBox="0 0 700 240"
      class="w-full h-full max-h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- ============================================== -->
      <!-- CIRCUITOS: Líneas técnicas con 45° y 90°       -->
      <!-- ============================================== -->
      <g :stroke="strokeColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Pista Superior 1 -->
        <path class="circuit-trace" d="M 20 40 L 140 40 L 175 75 L 340 75 L 365 50 L 460 50" />
        
        <!-- Pista Superior 2 (ramal a engranaje principal) -->
        <path class="circuit-trace" d="M 60 75 L 120 75 L 145 100 L 260 100 L 285 75 L 430 75 L 455 100 L 485 100" />
        
        <!-- Pista Central (Bus principal de datos) -->
        <path class="circuit-trace" d="M 10 120 L 210 120 L 240 150 L 390 150 L 420 120 L 470 120" />
        
        <!-- Pista Inferior 1 (enlace entre engranajes) -->
        <path class="circuit-trace" d="M 80 165 L 180 165 L 215 130 L 320 130 L 350 160 L 510 160 L 530 140 L 580 140" />

        <!-- Pista Inferior 2 (base del circuito) -->
        <path class="circuit-trace" d="M 30 200 L 160 200 L 190 170 L 300 170 L 340 210 L 520 210 L 555 175 L 660 175" />

        <!-- Ramales cortos y verticales -->
        <path class="circuit-trace" d="M 260 100 L 260 145" />
        <path class="circuit-trace" d="M 390 150 L 390 195 L 415 220 L 480 220" />
        <path class="circuit-trace" d="M 140 40 L 140 15 L 230 15" />
      </g>

      <!-- ============================================== -->
      <!-- NODOS / TERMINALES DE SOLDADURA                -->
      <!-- ============================================== -->
      <g :fill="strokeColor">
        <circle class="circuit-node" cx="20" cy="40" r="3.2" />
        <circle class="circuit-node" cx="60" cy="75" r="3.2" />
        <circle class="circuit-node" cx="10" cy="120" r="3.5" />
        <circle class="circuit-node" cx="80" cy="165" r="3" />
        <circle class="circuit-node" cx="30" cy="200" r="3" />
        
        <circle class="circuit-node" cx="230" cy="15" r="2.8" />
        <circle class="circuit-node" cx="260" cy="145" r="3" />
        <circle class="circuit-node" cx="480" cy="220" r="3.2" />
        <circle class="circuit-node" cx="580" cy="140" r="3.5" />
        <circle class="circuit-node" cx="660" cy="175" r="3.5" />
      </g>

      <!-- Puntos concéntricos decorativos -->
      <g :stroke="strokeColor" stroke-width="1.2" fill="none">
        <circle class="circuit-node" cx="10" cy="120" r="6.5" opacity="0.6" />
        <circle class="circuit-node" cx="660" cy="175" r="6.5" opacity="0.6" />
      </g>

      <!-- ============================================== -->
      <!-- ENGRANAJES MINIMALISTAS (Rotación con GSAP)    -->
      <!-- ============================================== -->
      
      <!-- Engranaje 1 (Principal - Centro en 515, 95) -->
      <g 
        ref="gear1Ref" 
        class="gear-element"
        :stroke="strokeColor" 
        :fill="accentColor" 
        stroke-width="1.5"
      >
        <!-- Dientes del engranaje (8 dientes limpios) -->
        <rect x="509" y="55" width="12" height="12" rx="2" fill-opacity="0.25" />
        <rect x="509" y="123" width="12" height="12" rx="2" fill-opacity="0.25" />
        <rect x="475" y="89" width="12" height="12" rx="2" fill-opacity="0.25" />
        <rect x="543" y="89" width="12" height="12" rx="2" fill-opacity="0.25" />
        
        <!-- Dientes diagonales -->
        <rect x="485" y="65" width="12" height="12" rx="2" transform="rotate(45 491 71)" fill-opacity="0.25" />
        <rect x="533" y="113" width="12" height="12" rx="2" transform="rotate(45 539 119)" fill-opacity="0.25" />
        <rect x="533" y="65" width="12" height="12" rx="2" transform="rotate(-45 539 71)" fill-opacity="0.25" />
        <rect x="485" y="113" width="12" height="12" rx="2" transform="rotate(-45 491 119)" fill-opacity="0.25" />

        <!-- Corona exterior e interior -->
        <circle cx="515" cy="95" r="32" fill-opacity="0.15" />
        <circle cx="515" cy="95" r="22" fill="#0b0f17" stroke-width="1.2" />
        <circle cx="515" cy="95" r="10" fill="none" stroke-width="1.2" stroke-dasharray="2 3" />
        <circle cx="515" cy="95" r="4.5" :fill="strokeColor" />
      </g>

      <!-- Engranaje 2 (Secundario engranado - Centro en 575, 145) -->
      <g 
        ref="gear2Ref" 
        class="gear-element"
        :stroke="strokeColor" 
        :fill="accentColor" 
        stroke-width="1.4"
      >
        <!-- Dientes del engranaje pequeño (6 dientes) -->
        <rect x="570" y="118" width="10" height="10" rx="1.5" fill-opacity="0.25" />
        <rect x="570" y="162" width="10" height="10" rx="1.5" fill-opacity="0.25" />
        <rect x="548" y="140" width="10" height="10" rx="1.5" transform="rotate(30 553 145)" fill-opacity="0.25" />
        <rect x="592" y="140" width="10" height="10" rx="1.5" transform="rotate(30 597 145)" fill-opacity="0.25" />
        <rect x="548" y="140" width="10" height="10" rx="1.5" transform="rotate(-30 553 145)" fill-opacity="0.25" />
        <rect x="592" y="140" width="10" height="10" rx="1.5" transform="rotate(-30 597 145)" fill-opacity="0.25" />

        <!-- Corona circular -->
        <circle cx="575" cy="145" r="23" fill-opacity="0.15" />
        <circle cx="575" cy="145" r="15" fill="#0b0f17" stroke-width="1" />
        <circle cx="575" cy="145" r="4" :fill="strokeColor" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.circuit-gear-bg {
  position: absolute;
  bottom: -12px;
  left: 50%;
  right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  transform-origin: center bottom;
  transform: translateY(10px) scale(var(--gear-scale, 1.25));
  z-index: 0;
  filter: saturate(0.9);
}

.circuit-gear-bg--left {
  left: -8%;
  right: auto;
}

.circuit-gear-bg--right {
  left: auto;
  right: -8%;
}

.circuit-gear-bg--center {
  left: 50%;
  transform: translateX(-50%) translateY(10px) scale(var(--gear-scale, 1.25));
}
</style>
