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
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   include: [resolve('node_modules/zustand/esm/middleware.js'), resolve('node_modules/react-query/es/devtools/devtools.js'), resolve('node_modules/react-query/es/devtools/utils.js')],
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         cacheDirectory: true, // 开启babel编译缓存
      //         cacheCompression: false, // 缓存文件不要压缩
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.ts[x]?$/,
        include: resolve('src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        include: resolve('src'),
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: `${subDir('images')}/[hash:8][ext][query]`,
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        include: resolve('src'),
        type: 'asset/resource',
        generator: {
          filename: `${subDir('media')}/[hash:8][ext][query]`,
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        include: resolve('src'),
        type: 'asset/resource',
        generator: {
          filename: `${subDir('fonts')}/[hash:8][ext][query]`,
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
