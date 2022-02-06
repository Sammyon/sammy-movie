const { verToken } = require("../helpers/jwt");
const { User, Movie, Genre } = require("../models");

class Controller {
  static async addMovie(req, res, next) {
    try {
      const { token } = req.headers;
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;
      const { authorId } = verToken(token);
      let addMovie = await Movie.create({
        title,
        synopsis,
        trailerUrl,
        imgUrl,
        rating,
        genreId,
        authorId,
      });
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
      });
      if (!movieData) throw { name: "noMovie" };
      res.status(200).json(movieData);
    } catch (error) {
      next(error);
    }
  }

  static async editMovie(req, res, next) {
    try {
      const { token } = req.headers;
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;
      const { authorId } = verToken(token);
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
        console.log(title, synopsis, trailerUrl, imgUrl, rating, authorId, genreId, `DONE UPDATE`);
        res.status(200).json(movieData);
      } catch (error) {
      next(error);
    }
  }

  static async deleteMovie(req, res, next) {
    try {
      const { movieId } = req.params;
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
      res.status(200).json(movieData);
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
