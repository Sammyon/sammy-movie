const { User, Movie, Genre, WatchList } = require("../models");
const { Op } = require("sequelize");

class ControllerCustomer {
  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      let newUser = await User.create({
        username,
        email,
        password,
        role: "user",
        phoneNumber,
        address,
      });
      res.status(201).json(newUser);
    } catch (error) {
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
          role: "user",
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
        .json({ role: newUser.role, username: newUser.username, isCreated, token: genToken });
    } catch (error) {
      next(error);
    }
  }

  static async addWatchList(req, res, next) {
    try {
      const { authorId } = req.user;
      const { MovieId } = req.body;

      const movie = await Movie.findByPk(MovieId);
      if (!movie) throw { name: "noMovie" };

      const [watchList, isCreated] = await WatchList.findOrCreate({
        where: {
          UserId: authorId,
          MovieId
        },
        defaults: {
          UserId: authorId,
          MovieId
        }
      });
      res.status(201).json(watchList);
    } catch (error) {
      next(error);
    }
  }

  static async deleteWatchList(req, res, next) {
    try {
      const { watchListId } = req.params;

      await WatchList.destroy({
        where: {
          id: watchListId,
        },
      });
      res.status(201).json({message: `Removed from Watch List`});
    } catch (error) {
      next(error);
    }
  }

  static async getWatchList(req, res, next) {
    try {
      const { role, authorId } = req.user;

      if (role !== "user") throw { name: "Not Enough Authority" }; //! ADD NEW AUTHORIZATION
      // console.log(role, id, req.user, `req.user`);
      const watchList = await WatchList.findAll({
        include: {
          model: Movie,
          include: {
            model: Genre,
          },
        },
        where: {
          UserId: authorId,
        },
      });
      // console.log(watchList, `WatchList`);
      res.status(200).json(watchList);
    } catch (error) {
      next(error);
    }
  }

  static async getMovies(req, res, next) {
    try {
      const { rating, genre, page } = req.query;
      console.log(rating, genre, page, `page`);
      const search = {
        include: {
          model: Genre,
        },
        where: {
          status: {
            [Op.not]: "archived",
          },
        },
        limit: 8,
        order: [["id", "ASC"]],
      };
      if (rating) {
        search.where.rating = rating;
      }
      if (genre) {
        search.where.genreId = genre;
      }
      if (page) {
        search.offset = 8 * (page - 1);
      }
      // console.log(search , `search`);
      let moviesData = await Movie.findAndCountAll(search);
      // console.log(moviesData);
      let pages = Math.ceil(moviesData.count / 8)
      console.log(pages, moviesData.count);
      res.status(200).json({count: pages, movies: moviesData.rows});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerCustomer;
