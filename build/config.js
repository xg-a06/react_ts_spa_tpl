const path = require('path');

const config = {
  buildDetail: false,
  devServer: {
    // static: {
    //   directory: path.resolve(__dirname, '../dist'),
    // },
    client: {
      // Can be `string`:
      //
      // To get protocol/hostname/port from browser
      // webSocketURL: 'auto://0.0.0.0:0/ws'
      // webSocketURL: {
      //   hostname: '0.0.0.0',
      //   pathname: '/ws',
      //   port: 8789,
      // },
    },
    port: 2233,
    hot: true,
    host: '0.0.0.0',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: {
      '/api': {
        target: 'http://172.16.7.22:8000/',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/xxx': '/',
        // },
      },
    },
  },
  local: {
    API_PATH: '/api',
    TIME_OUT: 1000 * 120, //两分钟
    SUB_DIR: 'static',
    PUBLIC_PATH: '/',
  },
  prod: {
    API_PATH: '/api',
    SUB_DIR: 'static',
    PUBLIC_PATH: '/',
  },
};

module.exports = config;
