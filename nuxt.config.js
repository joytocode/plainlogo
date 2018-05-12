const path = require('path')

exports.rootDir = __dirname

exports.srcDir = path.join(__dirname, 'src')

exports.loading = {
  color: '#81A07C',
  height: '3px'
}

exports.head = {
  titleTemplate: '%s - PlainLogo',
  meta: [
    { charset: 'utf-8' }
  ],
  link: [
    { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
  ]
}

exports.css = [
  path.join(__dirname, 'src/assets/css/app.styl')
]

exports.plugins = [
  path.join(__dirname, 'src/plugins/vuetify'),
  path.join(__dirname, 'src/plugins/vee-validate'),
  path.join(__dirname, 'src/plugins/vue-async-computed')
]

exports.serverMiddleware = [
  path.join(__dirname, 'src/server/ignore-src')
]

exports.build = {
  extractCSS: true,
  vendor: [
    // Only keep common vendor modules here
    'vuetify', 'vee-validate', 'vue-async-computed', 'opentype.js'
  ],
  extend (config) {
    // inline >= 2 will cause errors https://github.com/mishoo/UglifyJS2/issues/2842
    config.plugins.forEach((plugin) => {
      if (plugin.constructor.name !== 'UglifyJsPlugin') {
        return
      }
      plugin.options.uglifyOptions.compress = {
        ...(plugin.options.uglifyOptions.compress || {}),
        inline: 1
      }
    })
  }
}

exports.router = process.env.DEPLOY_ENV === 'GH_PAGES' ? { base: '/plainlogo/' } : {}
