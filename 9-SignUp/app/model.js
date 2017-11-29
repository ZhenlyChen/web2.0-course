const fs = require('fs')
let data = false
exports.getByName = async name => {
  try {
    await init()
    for (let user of data.users) {
      if (user.name === name) {
        return user
      }
    }
    return false
  } catch (error) {
    console.error(error)
  }
}

exports.add = async userData => {
  try {
    await init()
    for (let name in userData) {
      userData[name] = userData[name].toString().toLowerCase()
      for (let user of data.users) {
        if (userData[name] === user[name]) {
          return name
        }
      }
    }
    data.users.push(userData)
    await fs.writeFileSync(__dirname + '/../data/db.json', JSON.stringify(data), { encoding: 'utf-8' })
    return true
  } catch (error) {
    console.error(error)
  }
}

async function init() {
  try {
    if (!data) {
      try {
        data = await fs.readFileSync(__dirname + '/../data/db.json', { encoding: 'utf-8' })
        data = JSON.parse(data)
      } catch (error) {
        await fs.writeFileSync(__dirname + '/../data/db.json', JSON.stringify({ "users": [], "__v": 2 }), { encoding: 'utf-8' })
      }
    }
  } catch (error) {
    console.error(error)
  }
}
