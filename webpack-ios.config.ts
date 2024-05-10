import dotenv from 'dotenv';
import { GitRevisionPlugin } from 'git-revision-webpack-plugin';
import path from 'path';
import { EnvironmentPlugin, ProvidePlugin } from 'webpack';

import { PRODUCTION_URL } from './src/config';

dotenv.config();

const appVersion = require('./package.json').version;

const {
  APP_ENV = 'production',
  BASE_URL,
  HEAD,
} = process.env;
const gitRevisionPlugin = new GitRevisionPlugin();
const branch = HEAD || gitRevisionPlugin.branch();
const appRevision = !branch || branch === 'HEAD' ? gitRevisionPlugin.commithash()?.substring(0, 7) : branch;

// GitHub workflow uses an empty string as the default value if it's not in repository variables, so we cannot define a default value here
process.env.BASE_URL = process.env.BASE_URL || PRODUCTION_URL;

export default {
  mode: APP_ENV,

  target: 'web',

  optimization: {
    usedExports: true,
    chunkIds: 'named',
    minimize: false,
  },

  entry: {
    main: './src/entrypoint-ios.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist-ios'),
    chunkFormat: false,
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    /* eslint-disable no-null/no-null */
    new EnvironmentPlugin({
      APP_ENV: 'production',
      APP_NAME: null,
      APP_VERSION: appVersion,
      APP_REVISION: appRevision,
      TEST_SESSION: null,

      TONHTTPAPI_MAINNET_URL: null,
      TONHTTPAPI_MAINNET_API_KEY: null,
      TONHTTPAPI_TESTNET_URL: null,
      TONHTTPAPI_TESTNET_API_KEY: null,
      TONHTTPAPI_V3_MAINNET_API_URL: null,
      TONHTTPAPI_V3_TESTNET_API_URL: null,
      TONAPIIO_MAINNET_URL: null,
      TONAPIIO_TESTNET_URL: null,
      PROXY_HOSTS: null,
      BRILLIANT_API_BASE_URL: null,
      STAKING_POOLS: null,

      TONHTTPAPI_V3_MAINNET_API_KEY: null,
      TONHTTPAPI_V3_TESTNET_API_KEY: null,
      LIQUID_POOL: null,
      LIQUID_JETTON: null,
      IS_PACKAGED_ELECTRON: false,
      IS_ANDROID_DIRECT: false,
      ELECTRON_TONHTTPAPI_MAINNET_API_KEY: null,
      ELECTRON_TONHTTPAPI_TESTNET_API_KEY: null,
      BASE_URL,
      IS_EXTENSION: false,
      IS_FIREFOX_EXTENSION: false,
      IS_CAPACITOR: false,
      SWAP_FEE_ADDRESS: null,
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
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
