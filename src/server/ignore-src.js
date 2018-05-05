// Prevent browser from parsing /src/assets/css/app.css.map https://github.com/nuxt/nuxt.js/issues/2840

module.exports = function (req, res, next) {
  if (/^\/src\//.test(req.url)) {
    res.statusCode = 404
    res.end('Not Found')
    return
  }
  next()
}
