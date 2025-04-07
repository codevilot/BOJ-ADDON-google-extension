import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    webExtension({
      manifest: './manifest.json',
    }) as PluginOption,

  ],
});