const { User, Movie, Genre, History } = require("../models");
const {Op} = require ('sequelize')

class Controller {
  static async addMovie(req, res, next) {
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;
      // console.log(req.body, `REG BODY`);
      const { authorId, email } = req.user;
      let addMovie = await Movie.create({
        title,
        synopsis,
        trailerUrl,
        imgUrl,
        rating,
        genreId,
        authorId,
        status: "active",
      });
      let history = await History.create({
        entityId: addMovie.id,
        name: addMovie.title,
        description: `Movie with id ${addMovie.id} created`,
        updatedBy: email,
      });
      // console.log(addMovie, `DATA`);
      res.status(201).json(addMovie);
    } catch (error) {
      next(error);
    }
  }

  static async getMovies(req, res, next) {
    try {
      let moviesData = await Movie.findAll({
        include: {
          model: Genre,
        },
        where: {
          status: {
            [Op.not]: "archived"
          }
        }
      });
      // console.log(moviesData);
      res.status(200).json(moviesData);
    } catch (error) {
      next(error);
    }
  }

  static async movieDetail(req, res, next) {
    try {
      const { movieId } = req.params;
      let movieData = await Movie.findOne({
        where: {
          id: movieId,
        },
        include: {
          model: Genre,
        }
      });
      // if (movieData.status === "archived") {

      // }
      if (!movieData) throw { name: "noMovie" };
      res.status(200).json(movieData);
    } catch (error) {
      next(error);
    }
  }

  static async editMovie(req, res, next) {
    // console.log(req.params, `MASUK`);
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;
      const { authorId, email } = req.user;
      const { movieId } = req.params;
      let movieData = await Movie.update(
        { title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId },
        {
          where: {
            id: movieId,
          },
          returning: true,
        }
      );
      if (!movieData) throw { name: "noMovie" };
      let history = await History.create({
        entityId: movieData[1][0].id,
        name: movieData[1][0].title,
        description: `Movie with id ${movieData[1][0].id} updated`,
        updatedBy: email,
      });
      // console.log(title, synopsis, trailerUrl, imgUrl, rating, authorId, genreId, `DONE UPDATE`);
      res.status(200).json(movieData[1][0]);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMovie(req, res, next) {
    try {
      const { movieId } = req.params;
      const { email } = req.user;
      let movieData = await Movie.findOne({
        where: {
          id: movieId,
        },
      });

      if (!movieData) throw { name: "noMovie" };
      await Movie.destroy({
        where: {
          id: movieId,
        },
      });
      // let history = await History.create({
      //   entityId: movieData.id,
      //   name: movieData.title,
      //   description: `Movie with id ${movieData.id} permanently deleted`,
      //   updatedBy: email
      // })
      res.status(200).json(movieData);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { movieId } = req.params;
      const { status } = req.body;
      const { email } = req.user;
      // console.log(status, `STATUS`);
      let movieDataOld = await Movie.findOne({
        attributes: ["status"],
        where: {
          id: movieId,
        },
      });
      // console.log(movieDataOld, `OLD STATUS`);
      if (!movieDataOld) throw { name: "noMovie" };
      let movieData = await Movie.update(
        { status },
        {
          where: {
            id: movieId,
          },
          returning: true,
        }
      );
      let history = await History.create({
        entityId: movieData[1][0].id,
        name: movieData[1][0].title,
        description: `Movie with id ${
          movieData[1][0].id
        } status has been updated from ${!movieDataOld.status} to${!movieData.status}`,
        updatedBy: email,
      });
      // console.log(title, synopsis, trailerUrl, imgUrl, rating, authorId, genreId, `DONE UPDATE`);
      res.status(200).json(movieData);
    } catch (error) {
      next(error);
    }
  }

  static async archived(req, res, next) {
    try {
      const { movieId } = req.params;
      const { email } = req.user;
      let movieData = await Movie.update(
        { status: `archived` },
        {
          where: {
            id: movieId,
          },
          returning: true,
        }
      );
      let history = await History.create({
        entityId: movieData[1][0].id,
        name: movieData[1][0].title,
        description: `Movie with id ${movieData[1][0].id} permanently deleted`,
        updatedBy: email,
      });
      res.status(200).json(movieData);
    } catch (error) {
      next(error);
    }
  }

  static async listHistory(req, res) {
    try {
      let data = await History.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async listGenre(req, res) {
    try {
      let data = await Genre.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
