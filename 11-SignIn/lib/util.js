const crypto = require('crypto')
const rand = require('csprng')

exports.hashPassword = (password, salt) => {
  let data = {}
  data.salt = (salt === undefined) ? exports.rand(260) : salt
  data.password = exports.hash(exports.hash(password).toString().concat(data.salt))
  return data
}

exports.hash = value => {
  const hash = crypto.createHash('sha512')
  hash.update(value)
  return hash.digest('hex')
}

exports.rand = length => {
  return rand(length, 36)
}

exports.valid = (data, options) => {
  if (!data) throw new Error(options.message)
  if (options) {
    if (options.type) {
      switch (options.type) {
        case 'string':
          if (typeof data !== 'string') throw new Error(options.message)
          break
        case 'number':
          if (/^[0-9]$/.test(data) === false) throw new Error(options.message)
          break
      }
    }
    if (options.max && data.length > options.max) throw new Error(options.message)
    if (options.min && data.length < options.min) throw new Error(options.message)
    if (options.reg && !options.reg.test(data)) throw new Error(options.message)
  }
}
