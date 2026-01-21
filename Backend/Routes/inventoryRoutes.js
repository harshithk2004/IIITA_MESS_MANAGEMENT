const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../Middlewares/authMiddleware');
const { messinventory,inventoryfetch } = require('../Controllers/invetoryController');

router.post('/inventory', authenticateToken, authorizeAdmin, messinventory);
router.get('/fetch/items',authenticateToken,authorizeAdmin,inventoryfetch);

module.exports = router;
