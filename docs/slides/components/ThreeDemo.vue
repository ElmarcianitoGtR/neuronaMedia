<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let reqId = null

onMounted(() => {
  if (!container.value) return
  
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(200, 200)
  container.value.appendChild(renderer.domElement)
  
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshNormalMaterial()
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  
  camera.position.z = 2
  
  const animate = () => {
    reqId = requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  
  animate()
})

onBeforeUnmount(() => {
  if (reqId) cancelAnimationFrame(reqId)
})
</script>

<template>
  <div ref="container" class="flex justify-center items-center my-4 min-h-[200px]"></div>
</template>
