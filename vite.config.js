import { defineConfig } from 'vite';

export default defineConfig({
  base: '/asia-trip/',
  server: { port: 8080, open: false },
  build: { target: 'es2022' },
  esbuild: { target: 'es2022' },
  optimizeDeps: { esbuildOptions: { target: 'es2022' } },
});
