const express = require("express");
const router = express.Router();
const Controller = require("../controllers");
const authenticator = require("../middlewares/authenticator");
const movies = require("./movies");
const users = require("./users");
const google = require("./google");

router.use("/users", users);
router.use("/google", google);

router.use(authenticator);

router.use("/genres", Controller.listGenre)
router.use("/movies", movies);


module.exports = router;
