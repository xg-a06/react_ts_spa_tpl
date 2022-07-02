const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssnano = require('cssnano');
const chalk = require('chalk');
const config = require('./config');
const { subDir, getCssLoaders, resolve } = require('./utils');
const baseConfig = require('./webpack.base.conf');

const buildConfig = merge(baseConfig, {
  output: {
    filename: subDir('js/[name].[contenthash:8].js'),
    chunkFilename: subDir('js/[name].[contenthash:8].js'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'async',
          test: /[\\/]src[\\/]/,
          minChunks: 2,
          minSize: 30000,
          priority: -10,
          reuseExistingChunk: true,
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
        },
        ui: {
          name: 'ui',
          test: /[\\/]node_modules[\\/](antd|@ant-design|rc-.*|tinycolor2|async-validator)/,
          chunks: 'all',
          priority: 20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: getCssLoaders(),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('src/public'),
          to: resolve(`dist/${config[process.env.BUILD_ENV].SUB_DIR}`),
        },
      ],
    }),
    // ...[autoAddDllRes()],
    new MiniCssExtractPlugin({
      filename: subDir('css/[name].[contenthash:8].css'),
      chunkFilename: subDir('css/[name].[contenthash:8].css'),
    }),
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
      clear: false,
      width: 60,
    }),
  ],
});
if (config.buildDetail) {
  buildConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8899,
    }),
  );
}
module.exports = buildConfig;
