<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let reqId = null
let resizeObserver = null

onMounted(() => {
  if (!container.value) return

  // 1. Dimensiones adaptativas con fallback
  let currentW = container.value.clientWidth || 460
  let currentH = container.value.clientHeight || 520

  // 2. Escena y Cámara con perspectiva isométrica para visualización vertical
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, currentW / currentH, 0.1, 1000)
  camera.position.set(7, 1.5, 9.5)
  camera.lookAt(0, 0.5, 0)

  // 3. Renderizador WebGL con transparencia
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(currentW, currentH)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  container.value.appendChild(renderer.domElement)

  // 4. Iluminación tecnológica
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
  scene.add(ambientLight)

  const dirLightCyan = new THREE.DirectionalLight(0x38bdf8, 2.8) // Cian
  dirLightCyan.position.set(6, 10, 8)
  scene.add(dirLightCyan)

  const dirLightGreen = new THREE.DirectionalLight(0x10b981, 2.4) // Esmeralda
  dirLightGreen.position.set(-6, 8, -4)
  scene.add(dirLightGreen)

  const pointLight = new THREE.PointLight(0x06b6d4, 3.5, 25)
  pointLight.position.set(0, 0, 3)
  scene.add(pointLight)

  // 5. Rieles y Columnas Verticales de Telemetría (Líneas ascendentes)
  const railGroup = new THREE.Group()
  const railMat = new THREE.LineBasicMaterial({ 
    color: 0x0284c7, 
    transparent: true, 
    opacity: 0.35 
  })
  const mainRailMat = new THREE.LineBasicMaterial({ 
    color: 0x38bdf8, 
    transparent: true, 
    opacity: 0.85 
  })

  // Carriles verticales por donde suben los paquetes
  const lanes = [
    { x: -2.2, z: -1.2 },
    { x: 0.0,  z: -1.8 },
    { x: 2.2,  z: -1.2 },
    { x: -1.4, z: 1.2 },
    { x: 1.4,  z: 1.2 }
  ]

  // Rieles verticales continuos
  lanes.forEach((lane, idx) => {
    const pts = [new THREE.Vector3(lane.x, -10, lane.z), new THREE.Vector3(lane.x, 10, lane.z)]
    const geom = new THREE.BufferGeometry().setFromPoints(pts)
    const line = new THREE.Line(geom, idx === 1 ? mainRailMat : railMat)
    railGroup.add(line)
  })

  // Anillos guía horizontales a diferentes alturas
  const ringHeights = [-6, -2, 2, 6]
  ringHeights.forEach(y => {
    const ringPts = [
      new THREE.Vector3(-3.5, y, -2.5),
      new THREE.Vector3(3.5, y, -2.5),
      new THREE.Vector3(2.5, y, 2.5),
      new THREE.Vector3(-2.5, y, 2.5),
      new THREE.Vector3(-3.5, y, -2.5)
    ]
    const geom = new THREE.BufferGeometry().setFromPoints(ringPts)
    const ring = new THREE.Line(geom, railMat)
    railGroup.add(ring)
  })
  scene.add(railGroup)

  // 6. Almacén de Paquetes 3D que suben verticalmente
  const packages = []
  const palette = [
    { fill: 0x10b981, edge: 0x34d399 }, // Esmeralda / Verde
    { fill: 0x0284c7, edge: 0x38bdf8 }, // Azul / Cian
    { fill: 0x06b6d4, edge: 0x67e8f9 }, // Turquesa
    { fill: 0x6366f1, edge: 0xa5b4fc }  // Índigo
  ]

  const createPackage = (initialY = null) => {
    const size = Math.random() * 0.45 + 0.75 // Tamaño óptimo de 0.75 a 1.2 unidades
    const colorPair = palette[Math.floor(Math.random() * palette.length)]
    const group = new THREE.Group()

    // Núcleo del paquete translúcido y brillante
    const geom = new THREE.BoxGeometry(size, size, size)
    const mat = new THREE.MeshStandardMaterial({
      color: colorPair.fill,
      emissive: colorPair.fill,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.4
    })
    const mesh = new THREE.Mesh(geom, mat)
    group.add(mesh)

    // Wireframe neón de alta definición en bordes
    const edgesGeom = new THREE.EdgesGeometry(geom)
    const edgeMat = new THREE.LineBasicMaterial({ 
      color: colorPair.edge, 
      linewidth: 2, 
      transparent: true, 
      opacity: 0.95 
    })
    const wireframe = new THREE.LineSegments(edgesGeom, edgeMat)
    group.add(wireframe)

    // Posición inicial: Carril aleatorio y altura vertical
    const lane = lanes[Math.floor(Math.random() * lanes.length)]
    const startX = lane.x + (Math.random() - 0.5) * 0.4
    const startZ = lane.z + (Math.random() - 0.5) * 0.4
    const startY = initialY !== null ? initialY : (-9 - Math.random() * 3)

    group.position.set(startX, startY, startZ)

    // Velocidad de ascenso vertical
    const speed = Math.random() * 0.035 + 0.04
    const rotSpeedY = (Math.random() - 0.5) * 0.025
    const rotSpeedX = (Math.random() - 0.5) * 0.015

    scene.add(group)
    packages.push({ 
      group, 
      mesh, 
      wireframe, 
      speed, 
      rotSpeedY, 
      rotSpeedX,
      size,
      lane 
    })
  }

  // Pre-poblar 16 paquetes a lo largo de todo el eje vertical para estar activos de inmediato
  for (let i = 0; i < 16; i++) {
    const distributedY = -7.5 + i * 1.05 + (Math.random() - 0.5) * 0.5
    createPackage(distributedY)
  }

  // Actualización dinámica de dimensiones
  const updateSize = (w, h) => {
    if (w <= 0 || h <= 0) return
    currentW = w
    currentH = h
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }

  // ResizeObserver para ajuste exacto en la columna derecha
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          updateSize(width, height)
        }
      }
    })
    resizeObserver.observe(container.value)
  }

  // Loop de Animación
  const animate = () => {
    reqId = requestAnimationFrame(animate)

    // Verificación de tamaño continuo por si cambia de pantalla
    if (container.value) {
      const cw = container.value.clientWidth
      const ch = container.value.clientHeight
      if (cw > 0 && ch > 0 && (Math.abs(cw - currentW) > 5 || Math.abs(ch - currentH) > 5)) {
        updateSize(cw, ch)
      }
    }

    // ASCENSO VERTICAL (hacia arriba)
    for (let i = 0; i < packages.length; i++) {
      const p = packages[i]
      p.group.position.y += p.speed // Va hacia arriba
      p.mesh.rotation.y += p.rotSpeedY
      p.mesh.rotation.x += p.rotSpeedX
      p.wireframe.rotation.y = p.mesh.rotation.y
      p.wireframe.rotation.x = p.mesh.rotation.x

      // Al salir por arriba, se recicla por abajo sin fugas de memoria
      if (p.group.position.y > 8.5) {
        p.group.position.y = -8.5 - Math.random() * 2
        const lane = lanes[Math.floor(Math.random() * lanes.length)]
        p.group.position.x = lane.x + (Math.random() - 0.5) * 0.4
        p.group.position.z = lane.z + (Math.random() - 0.5) * 0.4
      }
    }

    // Rotación suave del grupo de rieles para perspectiva 3D rica
    railGroup.rotation.y = Math.sin(Date.now() * 0.0003) * 0.08

    renderer.render(scene, camera)
  }

  animate()

  // Limpieza al desmontar
  onBeforeUnmount(() => {
    if (reqId) cancelAnimationFrame(reqId)
    if (resizeObserver) resizeObserver.disconnect()

    packages.forEach(p => {
      scene.remove(p.group)
      p.mesh.geometry.dispose()
      p.mesh.material.dispose()
      p.wireframe.geometry.dispose()
      p.wireframe.material.dispose()
    })
    railGroup.children.forEach(line => {
      line.geometry.dispose()
      line.material.dispose()
    })
    renderer.dispose()
  })
})
</script>

<template>
  <div 
    ref="container" 
    class="w-full h-full bg-transparent overflow-hidden relative select-none pointer-events-none"
  ></div>
</template>