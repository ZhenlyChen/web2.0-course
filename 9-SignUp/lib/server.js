const http = require('http');
const querystring = require('querystring')
const url = require('url')
module.exports = function() {
  let Server = {
    createServer: function(option) {
      option = option || {}
      this.port = option.port || 8080
      this.route = option.route || this.defaultRoute
      this.server = http.createServer(this.serverEvent)
    },
    use: function(funs) {
      if (funs instanceof Array) {
        this.route.events = this.route.events.concat(funs)
      } else {
        this.route.events.push(funs)
      }
    },
    listen: function(port) {
      this.port = port || this.port
      this.server.listen(this.port)
      console.log(`listen at ${this.port}`)
    },
    serverEvent: async function(req, res) { // this is httpServer!
      try {
        let ctx = {
          req: req,
          res: res,
          post: '',
          param: url.parse(req.url, true),
          body: ''
        }
        req.on('data', function(chunk) {
          ctx.post += chunk;
        })
        req.on('end', async function() {
          if (ctx.post) ctx.post = JSON.parse(ctx.post)
          for (let i = 0; i < Server.route.events.length;) {
            let next = false
            await Server.route.events[i](ctx, () => { next = true })
            if (next) {
              i++
            } else {
              break;
            }
          }
          await Server.endEvent(ctx)
        })
      } catch (error) {
        console.error(error)
      }
    },
    endEvent: async function(ctx) {
      try {
        process.stdout.write(` - ${ctx.res.statusCode} by ${ctx.req.connection.remoteAddress} : ${ctx.req.headers['user-agent']}\n`)
        if (ctx.body) {
          ctx.res.end(ctx.body)
        } else {
          ctx.res.end()
        }
      } catch (error) {
        console.error(error)
      }
    },
    defaultRoute: {
      events: []
    }
  }
  return Server
}
