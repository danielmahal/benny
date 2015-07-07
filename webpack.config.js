module.exports = {
  devtool: 'eval',

  entry: [
    __dirname + '/src/index.html',
    __dirname + '/src/index.js'
  ],

  output: {
    path: __dirname + '/build',
    filename: 'index.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?cacheDirectory'
      },

      {
        test: /\.html$/,
        loader: 'file?name=[name].html'
      }
    ]
  }
}
