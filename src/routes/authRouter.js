const express = require("express");
const { body } = require("express-validator");

const { signup, login } = require("../controllers/authController");

const router = express.Router();

const signupValidate = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("The password must be at least 5 letters"),
  body("name").notEmpty().withMessage("Please enter your name"),
];

// /auth
router.put("/signup", signupValidate, signup);
router.post("/login", login);

module.exports = router;
