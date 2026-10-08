<template>
  <div class="min-h-[160px]">
    <h1 class="text-5xl md:text-6xl font-black text-slate-100 tracking-tight mb-6">
      
      <span v-for="(fragmento, index) in fragmentosRenderizados" :key="index" :class="fragmento.clases">
        {{ fragmento.texto }}
      </span>

      <span class="inline-block w-3 h-10 md:h-12 bg-green-500 animate-pulse ml-1 align-middle"></span>

    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const fragmentosOriginales = [
  { texto: "Sistema Digital de ", clases: "" },
  { texto: "Captura Única", clases: "text-green-500" }
]

const fragmentosRenderizados = ref([
  { texto: "", clases: fragmentosOriginales[0].clases }
])

onMounted(() => {
  let indiceFragmento = 0;
  let indiceCaracter = 0;

  const escribirTexto = () => {
    if (indiceFragmento < fragmentosOriginales.length) {
      if (fragmentosRenderizados.value.length <= indiceFragmento) {
        fragmentosRenderizados.value.push({ texto: "", clases: fragmentosOriginales[indiceFragmento].clases });
      }
      
      fragmentosRenderizados.value[indiceFragmento].texto += fragmentosOriginales[indiceFragmento].texto.charAt(indiceCaracter);
      indiceCaracter++;

      let velocidadTecleo = Math.random() * 50 + 30;

      if (indiceCaracter >= fragmentosOriginales[indiceFragmento].texto.length) {
        indiceFragmento++;
        indiceCaracter = 0;
        velocidadTecleo = 700; 
      }
      
      setTimeout(escribirTexto, velocidadTecleo);
    }
  }

  setTimeout(escribirTexto, 300);
})
</script>