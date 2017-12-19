const userService = require('../service/user')
const util = require('../../lib/util')
const _ = require('lodash')

function errHandler (req, res, next) {
  console.log('[ERROR]', res.locals.error)
  res.send({ state: false, reason: res.locals.error.message })
  res.end()
}

exports.logicPage = (req, res, next) => {
  if (req.query.username && req.session.userId) {
    userPage(req, res, next)
  } else if (req.session.userId) {
    res.redirect('/?username=' + req.session.userName)
  } else if (req.query.username) {
    res.redirect('/')
  } else {
    res.render('index.ejs')
  }
}

function userPage (req, res, next) {
  userService.userDetail(req.session.userId, (err, data) => {
    if (err) throw new Error(err)
    res.render('user.ejs', {
      name: data.name,
      phone: data.phone,
      id: data.id,
      email: data.email,
      text: req.query.username === req.session.userName ? '' : '只能够访问自己的数据'
    })
  })
}

exports.registerPage = (req, res) => {
  res.render('register.ejs')
}

exports.login = (req, res, next) => {
  try {
    let body = _.pick(req.body, ['name', 'password'])
    util.valid(body.name, { type: 'string', reg: /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/ })
    util.valid(body.password)
    userService.login(body.name, body.password, (e, userId) => {
      if (e) {
        res.locals.error = e
        errHandler(req, res, next)
      } else {
        req.session.userId = userId
        req.session.userName = body.name
        res.send({ state: true })
      }
    })
  } catch (error) {
    res.locals.error = error
    errHandler(req, res, next)
  }
}

exports.register = (req, res, next) => {
  try {
    let body = _.pick(req.body, ['name', 'password', 'id', 'phone', 'email'])
    util.valid(body.name, { type: 'string', reg: /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/, message: 'ERROR_NAME' })
    util.valid(body.password, { type: 'string', reg: /^[a-zA-Z0-9_-]{6,12}$/, message: 'ERROR_PASS' })
    util.valid(body.id, { type: 'string', reg: /^[1-9][0-9]{7}$/, message: 'ERROR_ID' })
    util.valid(body.phone, { type: 'string', reg: /^[1-9][0-9]{10}$/, message: 'ERROR_PHONE' })
    util.valid(body.email, { type: 'string', reg: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: 'ERROR_EMAIL' })
    let passData = util.hashPassword(body.password)
    userService.register({
      name: body.name,
      password: passData.password,
      salt: passData.salt,
      id: body.id,
      phone: body.phone,
      email: body.email
    }, (e, id) => {
      if (e) {
        res.locals.error = e
        errHandler(req, res, next)
      } else {
        res.send({ state: true })
        res.end()
      }
    })
  } catch (error) {
    res.locals.error = error
    errHandler(req, res, next)
  }
}

exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}
