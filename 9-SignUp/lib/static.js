const fs = require('fs')
const fileType = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  ico: 'image/ico',
  other: 'text/plain'
}

function getFileType(name) {
  let type = name.split('.')
  if (type.length !== 2) return fileType.other
  return fileType[type[1]] || fileType.other
}

module.exports = function(option) {
  option = option || {}
  let Static = {
    use: async function(path, pre) {
      try {
        pre = pre || ''
        let dirs = await fs.readdirSync(path + pre)
        for (let file of dirs) {
          if (fs.statSync(path + pre + '/' + file).isDirectory()) {
            await this.use(path, '/' + file + '/')
          } else {
            this.files.push({
              path: path,
              name: (pre + '/' + file).toString().replace(/\/\//g, '/')
            })
          }
        }
        return this
      } catch (error) {
        console.error(error)
      }
    },
    routes: async function(ctx, next) {
      try {
        let hasFile = false
        for (let file of Static.files) {
          let url = ctx.req.url === '/' ? Static.defaultIndex : ctx.req.url
          if (url.substr(0, file.name.length) === file.name || url + Static.defaultType === file.name) {
            let fileInfo = await fs.statSync(file.path + file.name)
            await ctx.res.writeHead(200, { 'Content-Type': getFileType(file.name) })
            let data = await fs.readFileSync(file.path + file.name)
            for (let preEvent of Static.preEvents) { // 预处理文件
              if (preEvent.name === file.name) {
                preEvent.fun(data)
              }
            }
            ctx.body = data
            hasFile = true
          }
        }
        if (!hasFile) await next()
      } catch (error) {
        console.error(error)
      }
    },
    pre: async function(name, fun) {
      Static.preEvents.push({
        name: name,
        fun: fun
      })
    },
    files: [],
    preEvents: [],
  }
  Static.defaultType = '.' + (option.defaultType || 'html')
  Static.defaultIndex = '/' + (option.defaultIndex || 'index.html')
  return Static
}
