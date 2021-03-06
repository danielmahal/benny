var debug = process.env.NODE_ENV !== 'production'
var devtool = debug && 'eval'

module.exports = {
  devtool: devtool,

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
        loader: 'babel?cacheDirectory',
        include: /src\//
      },

      {
        test: /\.html$/,
        loader: 'file?name=[name].html'
      },

      {
        test: /\.glsl$/,
        loader: 'raw'
      },

      {
        test: /\.json$/,
        loader: 'file'
      },

      {
        test: /libs\/lightgl\.js$/,
        loader: 'exports?GL'
      }
    ]
  }
}
