const express = require("express");

// Controllers
const { checkIn, getAttInfo } = require("../controllers/checkInOutController");

// Middlewares
const { isAuth } = require("../middlewares/authMiddleware");
const { messageValidate } = require("../middlewares/checkInOutMiddleware");

const router = express.Router();

// /attandance
router.post("/checkIn", isAuth, messageValidate, checkIn);
router.get("/attInfo", getAttInfo);
// router.post("/isCheckIn", isAuth, isCheckIn);

module.exports = router;
