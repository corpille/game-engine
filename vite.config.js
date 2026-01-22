import { js13kViteConfig } from 'js13k-vite-plugins';
import { defineConfig } from 'vite';

export default defineConfig(
  js13kViteConfig({
    roadrollerOptions: false,
    terserOptions: false,
    ectPlugin: false,
    advzipOptions: false,
  }),
);
