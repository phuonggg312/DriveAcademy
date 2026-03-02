import shopify from 'vite-plugin-shopify'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from "vite"
import { watch } from 'chokidar';
import fs from 'fs-extra'
import path from 'path';
import graphql from '@rollup/plugin-graphql';

const watchStaticAssets = () => ({
  name: 'watch-static-assets',
  configureServer(server) {
    const watcher = watch('./public/*', {
      persistent: true
    });

    const copyAsset = async path => {
      await fs.copy(path, `assets/${path.replace('public/', '')}`);
    }

    const removeAsset = async path => {
      await fs.remove(`assets/${path.replace('public/', '')}`);
    }

    watcher.on('add', copyAsset);
    watcher.on('change', copyAsset);
    watcher.on('unlink', removeAsset);
  }
})

export default defineConfig({
  clearScreen: false,
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'frontend/src'),
      '@project-stories': path.resolve(__dirname, 'frontend/src/stories'),
      'shopify': path.resolve(__dirname, 'frontend/js/shopify.js'),
      '@arctheme-components': path.resolve(__dirname, 'node_modules/@mindarc/arctheme-components/frontend/src/stories/components'),
      '@arctheme-hooks': path.resolve(__dirname, 'node_modules/@mindarc/arctheme-components/frontend/src/hooks')
    },
  },
  plugins: [
    watchStaticAssets(),
    shopify({
      snippetFile: 'vite.liquid'
    }),
    react({
      include: "**/*.tsx",
    }),
    tsconfigPaths(),
    graphql()
  ],
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].min.js',
        chunkFileNames: '[name].[hash].min.js',
        assetFileNames: '[name].[hash].min[extname]',
      },
    }
  }
});
