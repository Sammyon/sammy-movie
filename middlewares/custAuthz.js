const { User, WatchList } = require("../models");

const custAuthz = async (req, res, next) => {
  try {
    const { authorId, role } = req.user;
    const { watchListId } = req.params;

    if (role !== "user") {
      throw { name: "Not Enough Authority" };
    }

    const auth = await WatchList.findByPk(watchListId);
    if (!auth) {
      throw { name: "Not Enough Authority" };
    }

    if (auth.UserId !== authorId) {
      throw { name: "Not Enough Authority" }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = custAuthz;
