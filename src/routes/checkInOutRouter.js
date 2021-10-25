const express = require("express");

const { checkIn } = require("../controllers/checkInOutController");

const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// /attandance
router.post("/checkIn", isAuth, checkIn);

module.exports = router;
