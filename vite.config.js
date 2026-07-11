import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/authenticators': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/roles': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/policy': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/resources': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/secrets': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/whoami': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/authn': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
