const express = require('express');
const router = express.Router();
const { messfeedback ,feedbackfetch} = require('../Controllers/mealFeedbackController');
const { authenticateToken, authorizeAdmin } = require('../Middlewares/authMiddleware');

// Student submits feedback
router.post('/mess/feedback', authenticateToken, messfeedback);

// Admin views feedback page
router.get('/feedbacks',authenticateToken,authorizeAdmin,feedbackfetch);
module.exports = router;
