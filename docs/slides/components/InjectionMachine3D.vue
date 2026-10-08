<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '155px'
  }
})

const container = ref(null)
let reqId = null

onMounted(() => {
  if (!container.value) return

  let currentW = container.value.clientWidth || 260
  let currentH = 155

  // 1. Escena y Cámara cercana para visualización clara
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, currentW / currentH, 0.1, 100)
  camera.position.set(0, 0.6, 3.6)
  camera.lookAt(0, 0, 0)

  // 2. Renderizador WebGL con transparencia
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(currentW, currentH)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.maxWidth = '100%'
  container.value.appendChild(renderer.domElement)

  // 3. Sistema de Iluminación Industrial
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.2)
  dirLight.position.set(4, 5, 4)
  scene.add(dirLight)

  const backLight = new THREE.DirectionalLight(0x38bdf8, 1.2)
  backLight.position.set(-4, -2, -3)
  scene.add(backLight)

  const amberGlow = new THREE.PointLight(0xf59e0b, 3.5, 4)
  amberGlow.position.set(0, 0, 0)
  scene.add(amberGlow)

  // 4. Barras Guía de Acero (4 Tie Bars)
  const barGeo = new THREE.CylinderGeometry(0.035, 0.035, 3.6, 16)
  barGeo.rotateZ(Math.PI / 2)
  const barMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.8,
    roughness: 0.2
  })

  const tieBarCoords = [
    [-0.7, 0.55],
    [0.7, 0.55],
    [-0.7, -0.55],
    [0.7, -0.55]
  ]

  tieBarCoords.forEach(([y, z]) => {
    const bar = new THREE.Mesh(barGeo, barMat)
    bar.position.set(0, y, z)
    scene.add(bar)
  })

  // 5. Mitades del Molde (BoxGeometry wireframe + cuerpo metálico)
  const moldGeo = new THREE.BoxGeometry(0.7, 1.4, 1.2)
  const edgesGeo = new THREE.EdgesGeometry(moldGeo)
  const wireMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 })
  const moldBodyMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.7,
    roughness: 0.3,
    transparent: true,
    opacity: 0.65
  })

  // Molde Izquierdo (Móvil)
  const leftGroup = new THREE.Group()
  const leftBody = new THREE.Mesh(moldGeo, moldBodyMat)
  const leftLines = new THREE.LineSegments(edgesGeo, wireMat)
  leftGroup.add(leftBody)
  leftGroup.add(leftLines)
  scene.add(leftGroup)

  // Molde Derecho (Fijo)
  const rightGroup = new THREE.Group()
  const rightBody = new THREE.Mesh(moldGeo, moldBodyMat)
  const rightLines = new THREE.LineSegments(edgesGeo, wireMat)
  rightGroup.add(rightBody)
  rightGroup.add(rightLines)
  scene.add(rightGroup)

  // 6. Pieza Central Inyectada en Ámbar (#F59E0B)
  const pieceGeo = new THREE.TorusKnotGeometry(0.24, 0.075, 64, 16)
  const pieceMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.9,
    roughness: 0.15,
    metalness: 0.4
  })
  const moldedPiece = new THREE.Mesh(pieceGeo, pieceMat)
  scene.add(moldedPiece)

  // 7. Animación en requestAnimationFrame
  const clock = new THREE.Clock()

  const animate = () => {
    reqId = requestAnimationFrame(animate)

    if (container.value) {
      const newW = container.value.clientWidth
      if (newW > 0 && Math.abs(newW - currentW) > 5) {
        currentW = newW
        camera.aspect = currentW / currentH
        camera.updateProjectionMatrix()
        renderer.setSize(currentW, currentH)
      }
    }

    const t = clock.getElapsedTime() * 1.5
    const cycle = (Math.sin(t) + 1) / 2
    const smooth = cycle * cycle * (3 - 2 * cycle)

    const closedPos = 0.38
    const openPos = 1.15
    const posX = closedPos + (openPos - closedPos) * smooth

    leftGroup.position.x = -posX
    rightGroup.position.x = posX

    moldedPiece.rotation.y += 0.025
    moldedPiece.rotation.x += 0.012

    const scale = Math.max(0.1, smooth)
    moldedPiece.scale.set(scale, scale, scale)
    amberGlow.intensity = 1.0 + smooth * 3.5

    scene.rotation.y = Math.sin(t * 0.25) * 0.15
    scene.rotation.x = 0.08 + Math.cos(t * 0.25) * 0.04

    renderer.render(scene, camera)
  }

  animate()
})

onBeforeUnmount(() => {
  if (reqId) cancelAnimationFrame(reqId)
})
</script>

<template>
  <div class="card-clean p-3 flex flex-col items-center justify-between relative w-full h-full">
    <div class="w-full flex items-center justify-between text-[10px] font-mono mb-1">
      <span class="flex items-center gap-1.5 text-amber-400 font-semibold">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        INYECTORA 3D
      </span>
    </div>
    <div 
      ref="container" 
      class="w-full flex items-center justify-center bg-transparent overflow-hidden relative select-none pointer-events-none"
      :style="{ height: height, minHeight: height, width: width }"
    ></div>
  </div>
</template>
