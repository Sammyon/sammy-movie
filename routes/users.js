const express = require('express')
const router = express.Router()
const Controller = require('../controllers')
const ControllerLogin = require('../controllers/login')

router.post("/login", ControllerLogin.login);
router.post("/register", ControllerLogin.register);
router.get("/", ControllerLogin.userDetail);

module.exports = router