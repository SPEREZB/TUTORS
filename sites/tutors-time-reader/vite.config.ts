import { defineConfig } from 'vite'
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
  },
  server :{
    port:5000,
    host: true
  }
})