const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "blabla";

function token(data) {
  return jwt.sign(data, SECRET_KEY, {
    expiresIn: "1h",
  });
}

function verToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { token, verToken };
