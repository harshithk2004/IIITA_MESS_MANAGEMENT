const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { z } = require("zod");
const db = require("../connection");
const { createUser } = require('../Models/userModel');

const userSchemaValidate = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


const handleSignUp = async (req, res) => {
  try {
    const validationResult = userSchemaValidate.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages
      });
    }

    const userData = validationResult.data;
    const result = await createUser(userData);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error Signing Up", error);

    if (error.message.includes("ORA-00001")) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    if (error.message.includes("PHONENUMBER") || error.message.toLowerCase().includes("phone")) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists"
      });
    }


    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const conn = await db.getConnection();
    const result = await conn.execute(
      `SELECT 
         id, 
         firstName,
         lastName,
         email, 
         password AS hashed_password,
         isAdmin
       FROM users 
       WHERE email = :email`,
      { email },
      { outFormat: db.OUT_FORMAT_OBJECT }
    );
    
    conn.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user[4]); 
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const role = user[5] === 1 ? "admin" : "user";
    
    const token = jwt.sign({ id: user[0], role }, "your_secret_key", { expiresIn: "1h" });
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.ID,
        firstName: user.FIRSTNAME,
        lastName: user.LASTNAME,
        email: user.EMAIL,
        role,
      },
    });

  } catch (error) {
    console.error("Error Signing In", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};



const handleSignOut = (req, res) => {
  res.clearCookie("token");
  res.json({ 
    success: true, 
    message: "User signed out successfully" 
  });
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; 
    // console.log(userId);
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const conn = await db.getConnection();
    try {
      const result = await conn.execute(
        `SELECT id, firstName, lastName, email,phoneNumber FROM users WHERE id = :id`,
        { id: userId },
        { outFormat: db.OUT_FORMAT_OBJECT }
      );
      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, user: result.rows[0] });
    } finally {
      conn.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

module.exports = { handleSignUp, handleSignIn, handleSignOut, getUserProfile };
