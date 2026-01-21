const express = require("express");
const { handleSignUp, handleSignIn, handleSignOut ,getUserProfile} = require("../Controllers/userController");
const router = express.Router();
const {authenticateToken}=require('../Middlewares/authMiddleware')

router.post("/signup", handleSignUp);
router.post("/signin", handleSignIn);
router.post("/signout", handleSignOut);
router.get("/auth/me", authenticateToken, getUserProfile);

module.exports = router;