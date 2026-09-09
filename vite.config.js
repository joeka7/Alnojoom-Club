import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* Must match the backend's listen port (server/index.js: process.env.PORT ||
   3001). Set PORT to move both together. */
const API_TARGET = `http://localhost:${process.env.PORT || 3001}`

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.webp', '**/*.png'],
  server: {
    port: 5173,
    // Forward API calls to the backend during development so the frontend can
    // use same-origin "/api/..." paths — the same shape as production, where
    // one server serves both.
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        /* A bare ECONNREFUSED here says only that the connection failed, not
           why. In practice it always means the API process is not running, so
           say that instead of making the reader guess. */
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            if (err.code === 'ECONNREFUSED') {
              console.error(
                `\n[proxy] Cannot reach the API at ${API_TARGET} — is it running?` +
                  `\n        Start both with:  npm run dev:all\n`
              )
              if (res && !res.headersSent && res.writeHead) {
                res.writeHead(503, { 'Content-Type': 'application/json' })
                res.end(
                  JSON.stringify({
                    ok: false,
                    error: 'The API is not running. Start it with `npm run dev:all`.',
                  })
                )
              }
            }
          })
        },
      },
    },
  },
})
