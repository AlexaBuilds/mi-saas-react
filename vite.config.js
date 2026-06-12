import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 1. Importamos el plugin oficial

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // 👈 2. Registramos el plugin aquí para activar el motor
  ],
  base: '/mi-saas-react/',
  server: {
    host: true,
    port: 5173,
    strictPort: true
  }
})
