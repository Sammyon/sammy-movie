const ControllerCustomer = require("../controllers/customers");
const ControllerLogin = require("../controllers/login");
const Controller = require("../controllers");
const express = require("express");
const router = express.Router();
const authenticator = require("../middlewares/authenticator");
const custAuthz = require("../middlewares/custAuthz");

router.post("/register", ControllerCustomer.register);
router.post("/login", ControllerLogin.login);
router.post("/google", ControllerLogin.loginGoogle);
// router.get("/movies", ControllerCustomer.getMovies);
// router.get("/movies/:movieId", Controller.movieDetail);
//!AUTH & AUTZ
router.use(authenticator);

router.get("/movies", ControllerCustomer.getMovies);
router.get("/movies/:movieId", Controller.movieDetail);
router.get("/watchLists", ControllerCustomer.getWatchList);
router.post("/watchLists", ControllerCustomer.addWatchList);
router.delete(
  "/watchLists/:watchListId",
  custAuthz,
  ControllerCustomer.deleteWatchList
);

module.exports = router;
