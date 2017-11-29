const fs = require('fs')

module.exports = function() {
  let Hzml = {
    load: async(path) => {
      try {
        this.file = await fs.readFileSync(path, { encoding: 'utf-8' })
        this.file = this.file.toString('utf8')
        return this
      } catch (error) {
        console.error(error)
      }
    },
    set: async data => {
      try {
        for (let name in data) {
          this.file = this.file.replace(`<%=${name}%>`, data[name])
        }
        return this
      } catch (error) {
        console.error(error)
      }
    },
    router: async(ctx) => {
      await ctx.res.writeHead(200, { 'Content-Type': 'text/html' })
      ctx.body = Buffer.from(this.file)
    }
  }
  return Hzml
}
