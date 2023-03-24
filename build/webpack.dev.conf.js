const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const config = require('./config.js');
const { resolve, getCssLoaders } = require('./utils');
const baseConfig = require('./webpack.base.conf');

const devConfig = merge(baseConfig, {
  experiments: {
    lazyCompilation: true,
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devServer: config.devServer,
  module: {
    rules: getCssLoaders(),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new ESLintPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('src/public'),
          to: resolve(`dist/${config[process.env.BUILD_ENV].SUB_DIR}`),
        },
      ],
    }),
  ],
});

module.exports = devConfig;
