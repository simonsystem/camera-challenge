import path from 'path';
import { DefinePlugin, ProvidePlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTemplate from 'html-webpack-template';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

export default (env = {}) => ({
  mode: 'none',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{ loader: 'awesome-typescript-loader' }],
      include: [
        /src/,
      ],
    }, {
      test: /\.s?css$/,
      use: [
        { loader: MiniCssExtractPlugin.loader },
        { loader: 'css-loader' },
      ],
    }],
  },
  entry: {
    index: [
      !env.production && 'source-map-support/register',
      !env.production && !env.web && 'dotenv/config',
      '@babel/polyfill',
      'promise-polyfill/dist/polyfill',
      env.web && './src/style',
      './src/index',
    ].filter(x => x)
  },
  devtool: !env.production && 'source-map',
  devServer: {
    proxy: { '/': 'http://localhost:3000/' },
  },
  optimization: {
    minimize: !!env.production,
    minimizer: [
      env.production && new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // Must be set to true if using source-maps in production
      }),
      env.production && new OptimizeCSSAssetsPlugin({
        canPrint: true,
      }),
    ].filter(x => x),
  },
  plugins: [
    env.web && new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      appMountId: 'app',
      title: 'Camera Challenge',
      mobile: true,
      lang: 'de-DE',
      inject: false,
      minify: env.production && {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    env.web && new MiniCssExtractPlugin(),
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
      '.css',
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
