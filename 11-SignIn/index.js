const express = require('express')
const logger = require('morgan')
const path = require('path')
const session = require('express-session')
const config = require('./config')

let app = express()

// parse req.body
app.use(express.urlencoded({ extended: true }))

// log
app.use(logger('dev'))

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'XSsDJXucNo6qySSl2fzN7zKVvpvYF3fH2KwbX0H1Hyx06NMIlCKxiTXjnYLyUxov'
}))

// serve static files
app.use(express.static(path.join(__dirname, 'public')))

// listen prot

