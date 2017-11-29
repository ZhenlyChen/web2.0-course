const Server = require('./lib/server')
const route = require('./app/router')
const app = new Server()

app.createServer()
app.use(route.events)
app.listen(8080)
