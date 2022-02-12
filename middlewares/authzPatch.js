let authPatch = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "admin") {
      next();
    } else {
      throw { name: "Not Enough Authority" };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authPatch;