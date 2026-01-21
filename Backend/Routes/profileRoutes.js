const express = require('express');
const {
  getProfile,
  updateProfile,
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeeById
} = require("../Controllers/profileController");
const { authenticateToken ,authorizeAdmin} = require('../Middlewares/authMiddleware');

const router = express.Router();

// User profile routes
router.get("/user/profile", authenticateToken, getProfile);
router.put("/user/profile_update", authenticateToken, updateProfile);

// Employee management routes
router.get("/employees-details", authenticateToken,authorizeAdmin, getEmployees);
router.post("/employees-details", authenticateToken,authorizeAdmin, addEmployee);
router.put("/employees-details/:id", authenticateToken,authorizeAdmin, updateEmployee);
router.delete("/employees-details/:id", authenticateToken,authorizeAdmin, deleteEmployee);
router.get("/employees-details/search", authenticateToken,authorizeAdmin, searchEmployees);
router.get("/employee/:id",authenticateToken,authorizeAdmin, getEmployeeById);


module.exports = router;