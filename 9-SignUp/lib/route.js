const Methods = {
  get: 'GET',
  post: 'POST',
  delete: 'DELETE',
  put: 'PUT',
  patch: 'PATCH',
  use: 'USE'
}

module.exports = function() {
  let route = {
    events: [async function(ctx, next) {
      process.stdout.write(`${ctx.req.method} from ${ctx.req.url}`)
      await next()
    }]
  }
  for (let method in Methods) {
    route[method] = function(url, fun) {
      this.events.push(async function(ctx, next) {
        if ((method === 'use' || ctx.req.method === Methods[method]) && url === ctx.req.url.substr(0, url.length)) {
          ctx.res.statusCode = 200
          await fun(ctx, next)
        } else {
          await next()
        }
      })
    }
  }
  return route
}
