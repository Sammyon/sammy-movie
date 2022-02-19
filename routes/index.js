const express = require("express");
const router = express.Router();
const Controller = require("../controllers");
const authenticator = require("../middlewares/authenticator");
const movies = require("./movies");
const users = require("./users");
const google = require("./google");
const customers = require("./customers");

router.use("/users", users);
router.use("/google", google);
router.use("/customers", customers);

router.use(authenticator);

router.get("/genres", Controller.listGenre)
router.get("/histories", Controller.listHistory)
router.use("/movies", movies);


module.exports = router;
