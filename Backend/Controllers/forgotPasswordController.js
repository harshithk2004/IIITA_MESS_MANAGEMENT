const db = require("../connection");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rahul.pallabothula2005@gmail.com",
    pass: "xahx xtud izeh ckpc" 
  },
});

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const conn = await db.getConnection();

    const result = await conn.execute(
      `SELECT id FROM users WHERE email = :email`,
      { email }
    );

    if (result.rows.length === 0) {
      conn.release();
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiry = new Date(Date.now() + 3600000);
    await conn.execute(
      `DELETE FROM password_resets WHERE email = :email`,
      { email }
    );

    console.log(email,token, expiry);
    await conn.execute(
      `INSERT INTO password_resets (email, reset_token, expires_at) VALUES (:email, :token, :expiry)`,
      { email, token, expiry }
    );
    await conn.commit();
    conn.release();

    const resetURL = `http://localhost:5173/reset-password/${token}`;
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
             <p>This link is valid for 1 hour.</p>`,
    });

    res.json({ success: "Password reset email sent!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log("Reset password route hit:", req.params.token);
    const { password } = req.body;
    const token = req.params.token;
    const conn = await db.getConnection();

    const result = await conn.execute(
      `SELECT email FROM password_resets WHERE reset_token = :token AND expires_at > SYSTIMESTAMP`,
      { token }
    );
    await conn.commit();
    if (result.rows.length === 0) {
      conn.release();
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const email = result.rows[0][0]; 
    const hashedPassword = await bcrypt.hash(password, 10);
    await conn.execute(
      `UPDATE users SET password = :password WHERE email = :email`,
      { password: hashedPassword, email }
    );
    await conn.commit();
    await conn.execute(
      `DELETE FROM password_resets WHERE email = :email`,
      { email }
    );
    await conn.commit();
    conn.release();

    res.json({ success: "Password reset successful!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { requestPasswordReset, resetPassword };
