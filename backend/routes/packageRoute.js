const express = require("express");
const bcrypt = require("bcrypt");
const { jwt, sign } = require("jsonwebtoken");
const { createPackage, myPackage, updatePackageStatus, updatePackageDeliveryStatus, getAllPackages } = require("../controllers/packageController");
const isAdmin = require("../middleware/isAdmin");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();


// const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/new", authenticateToken,isAdmin, createPackage );

router.get("/:member_no", myPackage )

router.get("/",authenticateToken,isAdmin, getAllPackages )

router.put("/status/:packageId",authenticateToken, isAdmin, updatePackageStatus)

router.put("/:packageId",authenticateToken, isAdmin,  updatePackageDeliveryStatus)


// router.get("/search", getAllPackages)

module.exports = router;
