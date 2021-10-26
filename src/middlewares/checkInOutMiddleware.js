const { body } = require("express-validator");

exports.messageValidate = [body("message").trim().isLength({ max: 10 })];
