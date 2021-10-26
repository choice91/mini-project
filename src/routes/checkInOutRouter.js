const express = require("express");

const { checkIn, getAttInfo } = require("../controllers/checkInOutController");

const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// /attandance
router.post("/checkIn", isAuth, checkIn);
router.get("/attInfo", getAttInfo);

module.exports = router;
