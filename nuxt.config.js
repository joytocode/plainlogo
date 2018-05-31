require('dotenv').config()
const path = require('path')

exports.rootDir = __dirname

exports.srcDir = path.join(__dirname, 'src')

exports.env = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
}

exports.loading = {
  color: '#F9944D',
  height: '3px'
}

exports.head = {
  meta: [
    { charset: 'utf-8' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-title', content: 'PlainLogo' },
    { name: 'application-name', content: 'PlainLogo' },
    { name: 'msapplication-TileColor', content: '#ffffff' },
    { name: 'theme-color', content: '#ffffff' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui' }
  ],
  link: [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
    { rel: 'stylesheet', type: 'text/css', href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css', integrity: 'sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp', crossorigin: 'anonymous' }
  ]
}

exports.css = [
  path.join(__dirname, 'src/assets/css/app.styl')
]

exports.plugins = [
  path.join(__dirname, 'src/plugins/vuetify'),
  path.join(__dirname, 'src/plugins/vue-async-computed'),
  { src: path.join(__dirname, 'src/plugins/blob'), ssr: false }
]

exports.serverMiddleware = [
  path.join(__dirname, 'src/server/ignore-src')
]

exports.build = {
  extractCSS: true,
  vendor: [
    // Only keep common vendor modules here
    'axios', 'blob-polyfill', 'blueimp-canvas-to-blob', 'change-case', 'color-string', 'file-saver', 'js-base64',
    'lodash.debounce', 'opentype.js', 'qs', 'vue-async-computed', 'vue-color', 'vuetify'
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
