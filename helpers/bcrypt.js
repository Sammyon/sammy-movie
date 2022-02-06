const bcrypt = require('bcryptjs')

function encrypt(password, salt = 10) {
  const salted = bcrypt.genSaltSync(salt)
  return bcrypt.hashSync(password, salted)
}

module.exports = encrypt