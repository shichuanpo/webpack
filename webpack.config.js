var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

var __src_root__ = __dirname + '/app';
var __build_root__ = __dirname + '/build/';
var __asset_path__ = 'assets/';

module.exports = {
  entry: {
    main: __src_root__,
    vendor: ['jquery', 'angular']
  },
  output: {
    path: __build_root__,
    filename: __asset_path__ + '[name].js?[hash]',
    publicPath: ''
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: __asset_path__ + "vendor.js"
    }),
    new ExtractTextPlugin(__asset_path__ + "[name].css?[hash]"),
    new webpack.ProvidePlugin({
      '$': "jquery",
      'jQuery': "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([{
      from: __src_root__ + '/img',
      to: __build_root__ + '/img'
    }]),
    // entry html page
    new HtmlWebpackPlugin({
      title: 'main',
      chunks: ['main', 'vendor'],
      template: __src_root__ + '/index.html',
      inject: 'body',
      filename: __build_root__ + '/index.html'
    })
  ],
  externals: [
    require('webpack-require-http')
  ],
  module: {
    rules: [{
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'less-loader']
      })
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader']
      })
    }, {
      test: /\.js$/,
      use: ['strict-loader', 'ng-annotate-loader']
    },
      {
      test: /\.(png|jpg)$/,
      use: 'url-loader?limit=8192&name=' + __build_root__ + 'img/' + '[name].[ext]'  // inline base64 URLs for <=8k images, direct URLs for the rest
    }, {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: 'url-loader?name=' + __asset_path__ + '[name].[ext]'
    }]
  },
  devServer: {
    hot: true,
    inline: true,
    open: true,
    // proxy: {
    //   '/': 'http://172.16.16.196:8080'
    // }
  }
};
