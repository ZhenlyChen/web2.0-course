const Koa = require('koa')
const app = new Koa()
const logger = require('koa-logger')
const config = require('./config')

app.use(logger())
app.use(require('koa-helmet')())
app.use(require('kcors')({
  credentials: true
}))
app.keys = config.session.cookieKey
app.use(require('koa-session')(config.session, app))
app.use(require('koa-bodyparser')())
app.use(require('./app/router'))
app.listen(config.server.port)
