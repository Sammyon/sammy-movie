const express = require('express')
const router = express.Router()
const ControllerLogin = require('../controllers/login');
const authenticator = require('../middlewares/authenticator');

router.post("/login", ControllerLogin.login);
router.post("/register", ControllerLogin.register);
router.get("/", authenticator, ControllerLogin.userDetail);

module.exports = router