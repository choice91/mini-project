const express = require("express");

const { signup, login } = require("../controllers/authController");

const { signupValidate } = require("../middlewares/authMiddleware");

const router = express.Router();

// /auth
router.post("/signup", signupValidate, signup);
router.post("/login", login);

module.exports = router;
