const querystring = require('querystring')
const model = require('./model')
const Hzml = require('../lib/hzml')
const hzml = new Hzml()

exports.register = async ctx => {
  try {
    let data = ctx.post
    const checkRule = {
      name: t => /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(t),
      id: t => /^[1-9][0-9]{7}$/.test(t),
      phone: t => /^[1-9][0-9]{10}$/.test(t),
      email: t => /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(t)
    }
    let userData = {
      name: data.name,
      id: data.id,
      phone: data.phone,
      email: data.email,
    }
    for (let name in userData) {
      if (checkRule[name](userData[name]) === false) {
        ctx.res.write(JSON.stringify({ state: 'illegal' }))
        return;
      }
    }
    let result = await model.add(userData)
    if (result === true) {
      ctx.res.write(JSON.stringify({ state: true }))
    } else {
      ctx.res.write(JSON.stringify({ state: result }))
    }
  } catch (error) {
    console.error(error)
  }
}

exports.userPage = async(ctx, next) => {
  try {
    if (ctx.param.query.username) {
      let user = await model.getByName(ctx.param.query.username.toString().toLowerCase())
      if (user) {
        console.log(user)
        await hzml.load(__dirname + '/../hzml/user.hzml')
        await hzml.set({
          name: user.name,
          id: user.id,
          phone: user.phone,
          email: user.email,
        })
        await hzml.router(ctx)
      } else {
        ctx.res.writeHead(301, { 'Location': '/' });
      }
    } else {
      await next()
    }
  } catch (error) {
    console.error(error)
  }
}

exports.deal404 = async ctx => {
  ctx.res.writeHead(302, { 'Location': '/' });
}
