const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
  },
  node: {
   fs: "empty"
  }
};

const ENV = process.env.NODE_ENV;

if (ENV === 'production') {
  Object.assign(config, {
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.min.[hash].js'
    },

    plugins: [
      new UglifyJsPlugin()
    ],
  });
} else {
  Object.assign(config, {
    devtool: 'source-map',
  });

  if (ENV === 'demo') {
    Object.assign(config, {
      plugins: [
      ],
    })
  }
}

module.exports = config;
