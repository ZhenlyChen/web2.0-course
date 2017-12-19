const db = require('../../lib/mongo')
let userSchema = db.Schema({
  name: String,
  password: String,
  salt: String,
  email: String,
  phone: Number,
  id: Number
}, { collection: 'users' })
let UserDB = db.model('users', userSchema)

exports.add = async data => {
  try {
    let user = await UserDB.create(data)
    return user._id
  } catch (error) {
    return false
  }
}

exports.findById = async userId => {
  try {
    let user = await UserDB.findById(userId)
    return user
  } catch (error) {
    return false
  }
}

exports.findBy = async condition => {
  try {
    let user = await UserDB.findOne(condition)
    return user
  } catch (error) {
    return false
  }
}
