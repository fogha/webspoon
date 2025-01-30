import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Common build options for React
const commonConfig = {
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      'react': resolve(__dirname, '../node_modules/react'),
      'react-dom': resolve(__dirname, '../node_modules/react-dom')
    }
  }
};

// Build popup
await build({
  ...commonConfig,
  configFile: false,
  root: resolve(__dirname, '..'),
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, '../index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
});

// Build background script
await build({
  configFile: false,
  root: resolve(__dirname, '..'),
  build: {
    outDir: 'dist/assets',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, '../src/background/index.js'),
      formats: ['es'],
      fileName: () => 'background.js',
    },
    rollupOptions: {
      external: ['chrome'],
    },
  },
});

// Build content script
await build({
  configFile: false,
  root: resolve(__dirname, '..'),
  build: {
    outDir: 'dist/assets',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, '../src/content/index.js'),
      formats: ['es'],
      fileName: () => 'content.js',
    },
    rollupOptions: {
      external: ['chrome'],
    },
  },
});
