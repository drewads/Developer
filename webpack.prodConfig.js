const path = require('path');

module.exports = [
  {
    name: 'client',
    mode: 'production',
    entry: path.join(__dirname, 'src/index.jsx'),
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    watch: false,
  },
  {
    name: 'server-rendered',
    mode: 'production',
    entry: path.join(__dirname, 'src/renderedApp.jsx'),
    output: {
      path: path.join(__dirname, 'ssrDist'),
      filename: 'renderedAppBundle.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    watch: false,
  },
];