const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const vitePluginImp = require('vite-plugin-imp');
const viteCssModule = require('vite-plugin-style-modules');
const { createHtmlPlugin } = require('vite-plugin-html');
const { resolve } = require('./utils');
const config = require('./config');

module.exports = defineConfig({
  plugins: [
    react(),
    vitePluginImp.default({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/es/${name}/style/css.js`,
        },
      ],
    }),
    viteCssModule({
      path: /^(?!.*\.global).*\.less$/,
    }),
    createHtmlPlugin({ entry: resolve('src/index.tsx') }),
  ],
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
    },
  },
  define: {
    'process.env': {
      BUILD_ENV: process.env.BUILD_ENV,
      NODE_ENV: process.env.NODE_ENV,
      API_PATH: config[process.env.BUILD_ENV].API_PATH,
      SUB_DIR: config[process.env.BUILD_ENV].SUB_DIR,
      PUBLIC_PATH: config[process.env.BUILD_ENV].PUBLIC_PATH,
    },
  },

  server: {
    host: '0.0.0.0',
    port: 2234,
    open: true,
    https: false,
    ssr: false,
    base: '/',
    outDir: 'dist',
    proxy: {
      ...config.devServer.proxy,
    },
  },
});
