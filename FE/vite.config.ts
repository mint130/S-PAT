import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const env = isDev ? loadEnv(mode, process.cwd()) : {}

  const apiUrl = isDev ? env.VITE_API_URL : 'https://s-pat.site'

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    server: {
      host: isDev ? env.VITE_HOST : '0.0.0.0',
      port: 5173,
    },
  }
})
