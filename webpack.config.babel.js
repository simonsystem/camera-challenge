import path from 'path';
import { DefinePlugin, ProvidePlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTemplate from 'html-webpack-template';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';


// This is a combined webpack config which can handle 4 different config modes
export default (env = { production: false, web: false }) => ({
  mode: 'none', // ignore webpacks development/production defaults
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
      // Prepend polyfills and shims before code
      !env.production && 'source-map-support/register',
      !env.production && !env.web && 'dotenv/config',
      '@babel/polyfill',
      'promise-polyfill/dist/polyfill',
      // Include style.css in web only
      env.web && './src/style',
      // Main entrypoint is index.(node|web).ts
      './src/index',
    ].filter(Boolean)
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
    ].filter(Boolean),
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
  ].filter(Boolean),
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
  node: env.web && {
    fs: 'empty',
  },
  externals: [
    !env.web && nodeExternals(), // exclude all node_modules in server mode only
  ].filter(Boolean),
});
