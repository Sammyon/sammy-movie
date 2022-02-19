const bcrypt = require('bcryptjs')

function encrypt(password, salt = 10) {
  const salted = bcrypt.genSaltSync(salt)
  return bcrypt.hashSync(password, salted)
}

function decrypt(password, hash) {
  return bcrypt.compareSync(password, hash)
}

module.exports = {encrypt, decrypt}