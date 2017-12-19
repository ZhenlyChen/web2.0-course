const userModel = require('../model/user')
const util = require('../../lib/util')

exports.login = async (name, password, callback) => {
  try {
    let user = await userModel.findBy({ name: name })
    if (!user) throw new Error('ERROR_PASS')
    if (user.password !== util.hashPassword(password, user.salt).password) throw new Error('ERROR_PASS')
    callback(null, user._id)
  } catch (error) {
    callback(error)
  }
}

exports.register = async (data, callback) => {
  try {
    let user = await userModel.findBy({ name: data.name })
    if (user) throw new Error('HAD_NAME')
    user = await userModel.findBy({ id: data.id })
    if (user) throw new Error('HAD_ID')
    user = await userModel.findBy({ phone: data.phone })
    if (user) throw new Error('HAD_PHONE')
    user = await userModel.findBy({ email: data.email })
    if (user) throw new Error('HAD_EMAIL')
    let userId = await userModel.add(data)
    if (!userId) throw new Error('UN_KNOWN')
    callback(null, userId)
  } catch (error) {
    callback(error)
  }
}

exports.userDetail = async (id, callback) => {
  try {
    let user = await userModel.findById(id)
    if (!user) throw new Error('NO_USER')
    callback(null, user)
  } catch (error) {
    callback(error)
  }
}
