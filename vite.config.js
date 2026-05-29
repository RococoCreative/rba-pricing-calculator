import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the built assets work when embedded from any path
  // (e.g. served behind a sub-path or referenced from an iframe/script tag).
  base: './',
});
