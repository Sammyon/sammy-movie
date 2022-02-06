const { User, Movie, Genre } = require("../models");
const bcrypt = require("bcryptjs");
const { token, verToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
//! NANTI TARUH DI ENV
const clientID = new OAuth2Client(
  "975317000402-j24p2neqo5hborgvhu0q3mp6oor07he2.apps.googleusercontent.com"
);

class ControllerLogin {
  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      let newUser = await User.create({
        username,
        email,
        password,
        role: "admin",
        phoneNumber,
        address,
      });
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw { name: "noInput" };
      let data = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!data) {
        throw { name: "noEmail" };
      } else {
        const login = bcrypt.compareSync(password, data.password);
        if (!login) {
          throw { name: "wrongPassword" };
        } else {
          const payload = {
            authorId: data.id,
            email: data.email,
            username: data.username,
            role: data.role,
            phoneNumber: data.username,
            address: data.address,
            joinDate: data.joinDate
          };
          const genToken = token(payload);
          res.status(200).json({ token: genToken });
        }
      }
    } catch (error) {
      // console.log(error, "error");
      next(error);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const { googleToken } = req.body;
      const ticket = await clientID.verifyIdToken({
        idToken: googleToken,
        audience:
          "975317000402-j24p2neqo5hborgvhu0q3mp6oor07he2.apps.googleusercontent.com",
      }); //? Verify Google Token
      const payload = ticket.getPayload(); //? Decrypt isi googleToken
      // console.log(payload, `PAYLOAD GOOGLE`);

      let [newUser, isCreated] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: payload.email,
          role: "staff",
        },
      });
      const payloadToken = {
        authorId: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      };
      const genToken = token(payloadToken);
      res.status(201).json({ email: payload.email, isCreated, token: genToken });
    } catch (error) {
      next(error);
    }
  }

  static async googleReg(req, res, next) {
    try {
      const { email, password, phoneNumber, address } = req.body;

      let user = await User.update(
        {
          password,
          phoneNumber,
          address,
        },
        {
          where: {
            email,
          },
          individualHooks: true,
        }
      );

      res.status(201).json({ user, message: `Account has been created!` });
    } catch (error) {
      next(error);
    }
  }

  static async userDetail(req, res, next) {
    try {
      const { token } = req.headers;
      const { authorId } = verToken(token);
      const user = await User.findOne({
        attributes: {exclude: ['password']},
        where: {
          id: authorId
        }
      });
      if (!user) throw "User Not Found";
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerLogin;

