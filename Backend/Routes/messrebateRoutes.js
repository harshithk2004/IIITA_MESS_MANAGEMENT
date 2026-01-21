const express = require("express");
const router = express.Router();

const { authenticateToken, authorizeAdmin } = require('../Middlewares/authMiddleware');
const { submitRebateRequest ,getRebateRequests,updateRebateStatus} = require('../Controllers/messrebateController');

router.post('/mess/rebate', authenticateToken, submitRebateRequest);
router.get('/rebate-requests',authenticateToken,authorizeAdmin, getRebateRequests);
router.put('/rebate-requests/:id',authenticateToken,authorizeAdmin, updateRebateStatus);

module.exports = router;
