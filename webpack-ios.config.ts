import path from 'path';
import { DefinePlugin, EnvironmentPlugin, ProvidePlugin, webpack } from 'webpack';


import { PRODUCTION_URL } from './src/config';

// GitHub workflow uses an empty string as the default value if it's not in repository variables, so we cannot define a default value here
process.env.BASE_URL = process.env.BASE_URL || PRODUCTION_URL;

const { APP_ENV = 'production', BASE_URL } = process.env;

export default {
  mode: 'production',

  target: 'web',

  optimization: {
    usedExports: true,
    chunkIds: 'named',
    minimize: false,
  },

  entry: {
    main: './src/ios.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFormat: false,
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new EnvironmentPlugin({
      APP_ENV,
      BASE_URL,
      IS_PREVIEW: false,
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new DefinePlugin({
      process: { env: {} },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

};
