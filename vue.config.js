module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.coffee$/,
          use: [ 'coffee-loader' ]
        }
      ]
    }
  }
}