import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, proxy: { '/dm-logs': { target: 'http://localhost:3000', changeOrigin: true } } }
})
