const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8000',
    },
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({ template: 'src/index-template.html' }),
    new CopyWebpackPlugin([{ from: 'src/img', to: 'img' }]),
    new CopyWebpackPlugin([{ from: 'src/models', to: 'models' }]),
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'sass-loader' },
      ],
    }, {
      test: /\.(png|svg|jpg|gif|ttf|eot|woff|woff2|mp4)$/,
      use: [
        'file-loader',
      ],
    }],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
