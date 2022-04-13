/**
 * @see https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-file
 * webpack config @see https://webpack.js.org/configuration
 */
const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco');
const package = require('./package.json');
const CracoLessPlugin = require('craco-less');
const CracoSwcPlugin = require('craco-swc');
const CracoAlias = require('craco-alias');
const fs = require('fs');
const path = require('path');

const proxyConfig = [
  {
    context: ['/login', '/graphql', '/v3/graphql', '/chartdata', '/iam/password/reset', '/authorize'],
    target: process.env.PROXY_TARGET,
    changeOrigin: true,
  },
];
module.exports = {
  eslint: {
    mode: ESLINT_MODES.file,
  },
  webpack: {
    configure: (webpackConfig, { _env, _paths }) => {
      /**
       * export qiankun micro app lifecycles
       * @returns webpack config
       * @see https://qiankun.umijs.org/zh/faq#application-died-in-status-loading_source_code-you-need-to-export-the-functional-lifecycles-in-xxx-entry
       */
      webpackConfig.output.library = `${package.name}`;
      webpackConfig.output.libraryTarget = 'umd';
      webpackConfig.output.globalObject = 'window';
      return webpackConfig;
    },
  },
  /* Any devServer configuration options: https://webpack.js.org/configuration/dev-server/#devserver */
  devServer: {
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: proxyConfig,
  },
  jest: {
    configure: {
      testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
      transformIgnorePatterns: [
        // '/node_modules/@gio-design/components/node_modules/(?!@gio-design/icon).+\\.js$',
        // '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
        // '^.+\\.module\\.(css|sass|scss)$',
      ],
      moduleNameMapper: {
        // '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
        // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        //   '<rootDir>/__mocks__/fileMock.js',
        // '^@gio-design/components$': '<rootDir>/node_modules/@gio-design/components/es',
      },
      // coveragePathIgnorePatterns: ['/node_modules/'],
      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/interfaces.ts?(x)',
        '!src/**/*.d.ts',
        '!src/**/types.ts',
        '!src/__test?(s)__/**/*',
        '!src/**/__test?(s)__/*',
        '!src/setupProxy.js',
      ],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            strictMath: false,
          },
        },
      },
    },
    {
      plugin: CracoSwcPlugin,
      options: {
        swcLoaderOptions: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
                pragma: 'React.createElement',
                pragmaFrag: 'React.Fragment',
                throwIfNamespace: true,
              },
              optimizer: {
                globals: {
                  vars: {
                    __DEBUG__: 'true',
                  },
                },
              },
            },
            externalHelpers: true,
            target: 'es2015',
            parser: {
              syntax: 'typescript',
              tsx: true,
              decorators: true,
              dynamicImport: true,
            },
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: '.',
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: './tsconfig.extend.json',
      },
    },
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig, pluginOptions, context: { env, paths } }) => {
          if (env !== 'development') {
            return webpackConfig;
          }
          const content = JSON.stringify(webpackConfig, null, 4);
          if (pluginOptions.eject === true) {
            console.log('will eject webpackConfig to file %s', path.join(paths.appPath, 'webpack.runtime.config.json'));
            fs.writeFileSync(path.join(paths.appPath, 'webpack.runtime.config.json'), content, { encoding: 'utf-8' });
          }
          // Always return the config object.
          return webpackConfig;
        },
      },
      // to log webpack config you can set eject:true
      options: { eject: false },
    },
  ],
};
