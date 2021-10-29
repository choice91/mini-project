const express = require("express");

// Controllers
const { signup, login } = require("../controllers/authController");

// Middlewares
const { signupValidate } = require("../middlewares/authMiddleware");

const router = express.Router();

// /auth
router.post("/signup", signupValidate, signup);
router.post("/login", login);

module.exports = router;
