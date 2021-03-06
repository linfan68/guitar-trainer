module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      const excludePlugins = [
        require('@intervolga/optimize-cssnano-plugin')
      ]

      config.plugins = config.plugins.filter(p => !excludePlugins.includes(p.constructor))
    } else {
      // mutate for development...
    }
  }
}