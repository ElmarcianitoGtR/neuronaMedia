<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const box = ref(null)

onMounted(() => {
  gsap.to(box.value, { 
    rotation: 360, 
    x: 200, 
    duration: 2, 
    ease: 'bounce.out', 
    repeat: -1, 
    yoyo: true 
  })
})
</script>

<template>
  <div class="my-4 p-4 overflow-hidden">
    <div ref="box" class="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
      GSAP
    </div>
  </div>
</template>
