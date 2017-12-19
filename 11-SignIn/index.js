const express = require('express')
const logger = require('morgan')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const favicon = require('serve-favicon')
const config = require('./config')
const cookieParser = require('cookie-parser')
const program = require('commander')
const Ejs = require('ejs')
const app = express()

// ejs
app.engine('ejs', Ejs.renderFile)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

program
  .usage('[options] [value ...]')
  .option('-p, --port <integer>', 'set the port')
  .option('-d, --dev', 'development environment')
  .parse(process.argv)

if (program.dev) {
  app.use(errorHandler())
  app.use(logger('dev'))
} else {
  app.use(logger('combined'))
}
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())
app.use(session(config.session))

app.use(express.static(path.join(__dirname, 'public')))
app.use(require('./app/router'))

app.use((req, res, next) => {
  res.status(404).send('404 NOT FOUND!')
})

const server = app.listen(program.port || 8080, () => {
  console.log(
    `Server is listening at http://${server.address().address}:${server.address().port}`)
})
