const { verToken } = require("../helpers/jwt");
const { User } = require("../models");

let authenticator = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const deToken = verToken(token);

    const user = await User.findByPk(deToken.authorId);
    // console.log(deToken);
    if (!user) throw { name: `Invalid Token or User` };
    req.user = {
      authorId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticator;
