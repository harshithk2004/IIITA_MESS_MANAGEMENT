const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../Middlewares/authMiddleware');
const { fetchExpenditureData, fetchEmployeesExpenditureData } = require('../Controllers/expenditureController');

router.get('/fetch/inventory', authenticateToken, authorizeAdmin, fetchExpenditureData);
router.get('/fetch/employees', authenticateToken, authorizeAdmin, fetchEmployeesExpenditureData);

module.exports = router;
