var webpack = require('webpack');

module.exports = {
  entry: './src/index',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-1']
        }
      }
    ]
  },
  output: {
    filename: 'dist/normalize-json-api.min.js',
    libraryTarget: 'umd',
    library: 'normalize-json-api'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
};
