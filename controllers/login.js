const { User, Movie, Genre } = require("../models");
const { token } = require("../helpers/jwt");
const { decrypt } = require("../helpers/bcrypt");
const { OAuth2Client } = require("google-auth-library");
//! NANTI TARUH DI ENV
const clientID = new OAuth2Client(process.env.CLIENT_ID);

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
      console.log(email, password);
      if (!email || !password) throw { name: "noInput" };
      let data = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!data) {
        throw { name: "noEmail" };
      } else {
        const login = decrypt(password, data.password);
        if (!login) {
          throw { name: "wrongPassword" };
        } else {
          const payload = {
            authorId: data.id,
            email: data.email,
            username: data.username,
            role: data.role,
          };
          const genToken = token(payload);
          res.status(200).json({ token: genToken, username: data.username, role: data.role, });
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
        audience: process.env.CLIENT_ID,
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
      res
        .status(201)
        .json({ email: payload.email, isCreated, token: genToken });
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
      const { authorId } = req.user;
      const user = await User.findOne({
        attributes: { exclude: ["password"] },
        where: {
          id: authorId,
        },
      });
      if (!user) throw "User Not Found";
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerLogin;
