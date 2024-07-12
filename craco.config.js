const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
        zlib: require.resolve('browserify-zlib'),
        util: require.resolve('util/'),
        vm: require.resolve('vm-browserify'),
      };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    },
  },
};
