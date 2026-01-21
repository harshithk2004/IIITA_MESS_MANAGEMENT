const jwt = require("jsonwebtoken");

// Middleware to authenticate any valid user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid Token" });
  }
};

// Middleware to check if the user is an admin
const authorizeAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.role === "admin") {
    next(); // Admin verified
  } else {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
};

module.exports = { authenticateToken, authorizeAdmin };
