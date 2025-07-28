import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/charging-stations': {
        target: 'https://api.openchargemap.io/v3/poi/',
        changeOrigin: true,
        secure: true,
        // No rewrite, just forward the path
      },
    },
  },
})
