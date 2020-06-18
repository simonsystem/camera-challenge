import fs from 'fs';
import path from 'path';
import { DefinePlugin, ProvidePlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTemplate from 'html-webpack-template';

export default (env = {}) => ({
  mode: 'none',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'awesome-typescript-loader',
      }],
      include: [
        /src/,
      ],
    }],
  },
  entry: {
    index: [!env.production && 'source-map-support/register', '@babel/polyfill', 'promise-polyfill/dist/polyfill', './src/index'].filter(x => x)
  },
  devtool: 'source-map',
  devServer: {
    port: 8080,
    proxy: {
      '/': 'http://localhost:3000/'
    }
  },
  optimization: {
    minimize: !!env.production,
    minimizer: [
      env.production && new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // Must be set to true if using source-maps in production
      }),
    ].filter(x => x),
  },
  plugins: [
    env.web && new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      appMountId: 'app',
      title: 'Camera Challenge',
    }),
    ! env.web && new NodemonPlugin(),
  ].filter(x => x),
  output: {
    path: path.resolve(__dirname, env.web ? './web' : './dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: [
      env.web ? '.web.tsx' : '.node.tsx',
      env.web ? '.web.ts' : '.node.ts',
      env.web ? '.web.js' : '.node.js',
      '.tsx',
      '.ts',
      '.js',
    ],
  },
  target: env.web ? 'web' : 'node',
  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
  },
  externals: [
    !env.web && nodeExternals(),
  ].filter(x => x),
});
