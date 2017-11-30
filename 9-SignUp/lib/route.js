module.exports = function() {
  let route = {
    get: function(url, fun) {
      this.events.push(async function(ctx, next) {
        if (ctx.req.method === 'GET' && url === ctx.req.url.substr(0, url.length)) {
          ctx.res.statusCode = 200
          await fun(ctx, next)
        } else {
          await next()
        }
      })
    },
    post: function(url, fun) {
      this.events.push(async function(ctx, next) {
        if (ctx.req.method === 'POST' && url === ctx.req.url.substr(0, url.length)) {
          ctx.res.statusCode = 200
          await fun(ctx, next)
        } else {
          await next()
        }
      })
    },
    use: function(url, fun) {
      this.events.push(async function(ctx, next) {
        if (url === ctx.req.url.substr(0, url.length)) {
          await fun(ctx, next)
        } else {
          await next()
        }
      })
    },
    events: [async function(ctx, next) {
      process.stdout.write(`${ctx.req.method} from ${ctx.req.url}`)
      await next()
    }]
  }
  return route
}
