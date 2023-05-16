const express = require("express");
const bcrypt = require("bcrypt");
const { jwt, sign } = require("jsonwebtoken");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();


// const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/register", registerUser );


router.post("/login", loginUser);
  

module.exports = router;
