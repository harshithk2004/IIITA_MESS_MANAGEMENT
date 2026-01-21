const express = require("express");
const { getMessTimings, getMessMenu,updateMessMenu } = require("../Controllers/messController");
const { authenticateToken ,authorizeAdmin} = require('../Middlewares/authMiddleware');

const router = express.Router();

router.get("/mess-timings", authenticateToken,getMessTimings);
router.get("/mess-menu", authenticateToken,getMessMenu);


router.put('/mess-menu-edit',authenticateToken,authorizeAdmin,updateMessMenu);

module.exports = router;
