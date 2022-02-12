const express = require('express')
const router = express.Router()
const Controller = require('../controllers');
const authPatch = require('../middlewares/authzPatch');
const authorizator = require('../middlewares/authorizator');

router.post("/", Controller.addMovie);
router.get("/", Controller.getMovies);
router.get("/:movieId", Controller.movieDetail);

router.patch("/:movieId", authPatch, Controller.updateStatus);
router.put("/:movieId", authorizator, Controller.editMovie);
router.delete("/:movieId", authorizator, Controller.deleteMovie);

module.exports = router