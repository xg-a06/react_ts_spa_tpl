const config = {
  workspace: '../',
  entry: '../src/index.tsx',
  analysis: false,
  devServer: {
    port: 2233,
    proxy: {
      '/api': {
        target: 'http://10.0.70.49:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 19000,
  },
  path: {
    distPath: '../dist',
  },
  variables: {
    NODE_ENV: process.env.NODE_ENV,
    API_PATH: '/api',
  },
};

module.exports = config;
