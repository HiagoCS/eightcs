import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: 'terser', // Força o uso do Terser para podermos configurar a minificação
    terserOptions: {
      keep_fnames: true, // OBRIGATÓRIO: Impede que o Vite mude o nome das suas funções/componentes (ex: HomePage continuará sendo HomePage)
      keep_classnames: true
    }
  }
})
