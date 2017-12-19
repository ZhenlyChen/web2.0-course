module.exports = {
  cookie: ('name', 'value', { path: '/', httpOnly: true, secure: false, maxAge: 3600 * 1000 }),
  name: 'sessionId',
  resave: true,
  saveUninitialized: true,
  secret: 'XSsDJXucNo6qySSl2fzN7zKVvpvYF3fH2KwbX0H1Hyx06NMIlCKxiTXjnYLyUxov'
}
