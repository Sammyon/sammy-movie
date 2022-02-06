const { User, Movie } = require("../models");

const authorizator = async (req, res, next) => {
  try {
    const { authorId, role } = req.user;
    const { movieId } = req.params;
    if (role === "admin") {
      next();
    } else {
      const auth = await Movie.findOne({
        where: {
          id: movieId,
          authorId,
        },
      });
      if (!auth) throw { name: "Not Enough Authority" };
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authorizator;
