import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'build',
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      treeshake: 'recommended',
      cache: true,
    },
  },
});
