import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/sim-utils/',
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // Inject <base href="/sim-utils/"> into the <head>
        return html.replace(
          /<head>/,
          `<head><base href="/sim-utils/">`
        )
      }
    }
  ]
})