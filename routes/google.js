const ControllerLogin = require("../controllers/login");  const express = require('express')
const router = express.Router()

router.post("/", ControllerLogin.loginGoogle);
router.post("/register", ControllerLogin.googleReg);

module.exports = router