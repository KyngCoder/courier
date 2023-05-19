const express = require("express");
const bcrypt = require("bcrypt");
const { jwt, sign } = require("jsonwebtoken");
const { registerUser, loginUser, getAllUsers, updateProfile } = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();




router.post("/register", registerUser );


router.post("/login", loginUser);
  
router.get("/",authenticateToken, isAdmin, getAllUsers)

router.put("/:userId", updateProfile)

module.exports = router;
