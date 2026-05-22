import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Permite que o servidor seja acessado externamente pelo Docker
    port: 5173, // Porta padrão do Vite
    strictPort: true,
    watch: {
      usePolling: true, // Força a verificação de alterações nos arquivos
    },
    hmr: {
      clientPort: 5173, // Garante que o navegador conecte na porta correta para o Hot Reload
    },
  }
})