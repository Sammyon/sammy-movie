function errorHandler(err, req, res, next) {
  console.log(err.name, err, "ERROR HANDLER");
  switch (err.name) {
    case "SequelizeValidationError":
      let errArr = err.errors.map((e) => e.message);
      res.status(400).json({ Error: errArr });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ Error: "Email Must be Unique" });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ Error: "Invalid Token or User" });
      break;
    case "TokenExpiredError":
      res.status(401).json({ Error: "Invalid Token or User" });
      break;
    case "Invalid Token or User":
      res.status(401).json({ Error: "Invalid Token or User" });
      break;
    case "Not Enough Authority":
      res.status(403).json({ Error: "Not Enough Authority" });
      break;
    case "noInput":
      res.status(401).json({ Error: "Input Name and Password" });
      break;  
    case "wrongPassword":
      res.status(401).json({ Error: "Wrong Email or Password" });
      break;
    case "noEmail":
      res.status(401).json({ Error: "Wrong Email or Password" });
      break;
    case "noMovie":
      res.status(404).json({ Error: "Error Movie not Found" });
      break;
    default:
      res.status(500).json({ Error: "Internal Server Error" });
      break;
  }
}

module.exports = errorHandler;
