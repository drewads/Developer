const path = require('path');

module.exports = {
  module: {
    output: {
      path: path.resolve(__dirname, "dist"),
    },
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};