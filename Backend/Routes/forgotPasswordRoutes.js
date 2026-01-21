const express = require("express");
const { requestPasswordReset, resetPassword } = require("../Controllers/forgotPasswordController");
const router = express.Router();

router.post("/auth/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
