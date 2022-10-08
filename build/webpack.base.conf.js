const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config');
const { resolve, subDir } = require('./utils');

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = {
  target: 'web',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'inline-source-map',
  entry: {
    main: [resolve('src/index.tsx')],
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    publicPath: config[process.env.BUILD_ENV].PUBLIC_PATH,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [resolve('node_modules/zustand/esm/middleware.js'), resolve('node_modules/react-query/es/devtools/devtools.js'), resolve('node_modules/react-query/es/devtools/utils.js')],
        use: ['babel-loader?cacheDirectory=true'],
      },
      {
        test: /\.mdx$/,
        include: resolve('src'),
        use: [
          'babel-loader?cacheDirectory=true',
          {
            loader: resolve('build/loader/mdxloader'),
            options: {
              /* jsxImportSource: …, otherOptions… */
            },
          },
        ],
      },
      {
        test: /\.ts[x]?$/,
        include: resolve('src'),
        use: ['babel-loader?cacheDirectory=true'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: subDir('images'),
            limit: 8192, // 8k以下base64
          },
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: subDir('media'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: subDir('fonts'),
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      filename: 'index.html',
      minify: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_PATH: JSON.stringify(config[process.env.BUILD_ENV].API_PATH),
        SUB_DIR: JSON.stringify(config[process.env.BUILD_ENV].SUB_DIR),
        PUBLIC_PATH: JSON.stringify(config[process.env.BUILD_ENV].PUBLIC_PATH),
      },
    }),
  ],
};

module.exports = baseConfig;
