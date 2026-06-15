import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { hostname } from 'node:os'

const localHostname = hostname()
const allowedHosts = [...new Set([
  localHostname,
  localHostname.toLowerCase(),
  localHostname.toUpperCase(),
])]

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts,
  },
})
