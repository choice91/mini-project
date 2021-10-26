const express = require("express");

const {
  checkIn,
  getAttInfo,
  isCheckIn,
} = require("../controllers/checkInOutController");

const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// /attandance
router.post("/checkIn", isAuth, checkIn);
router.get("/attInfo", getAttInfo);
router.post("/isCheckIn", isAuth, isCheckIn);

module.exports = router;
