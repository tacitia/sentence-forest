'use strict';

var path = require('path');
var webpack = require('webpack');

// Find bower path
var fs = require('fs');
var bowerPath = 'bower_components';
try{
  if(fs.statSync(__dirname + '/.bowerrc')){
    var bowerrc = JSON.parse(fs.readFileSync(__dirname + '/.bowerrc', 'utf-8'));
    if(bowerrc.directory){
      bowerPath = __dirname + '/' + bowerrc.directory;
    }
  }
}
catch(ex){}

// Detect environment
var isProduction = process.env.NODE_ENV=='production';

// create config
var config = {
  entry: {
    'main': './src/app/main.js'
  },
  output: {
    path: path.join(__dirname, 'dist/app'),
    filename: '[name].js'
  },
  module:{
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-object-assign']
        }
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['style', 'css', 'sass']
      },
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
    ],
  },
  resolve: {
    modulesDirectories: [bowerPath, 'node_modules'],
    alias: {},
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    )
  ],
  devtool: isProduction ? undefined : 'eval'
};

if(isProduction){
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  );
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      report: 'min',
      compress: false, //{ warnings: false },
      preserveComments: false,
      mangle: false,
      // mangle: {
      //   except: ['$super', '$', 'exports', 'require']
      // }
    })
  )
}

module.exports = config;