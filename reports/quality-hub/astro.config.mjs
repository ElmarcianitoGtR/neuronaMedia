import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // Habilita SSR y Endpoints de API dinámicos
  adapter: node({
    mode: 'standalone'
  })
});
