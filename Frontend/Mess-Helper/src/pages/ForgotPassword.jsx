import React, { useState } from "react";
import styles from "../styles/ForgotPassword.module.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log(response);
      const data = await response.json();

      if (data.success) {
        setMessage("Password reset link sent to your email.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      setError("Failed to send reset link.");
    }
    setLoading(false);
  };

  return (
    <div className={styles["forgot-password-box"]}>
      <h2>Reset Your Password</h2>
      <p>Enter your email to receive a password reset link.</p>

      {message && <p className={styles["success-message"]}>{message}</p>}
      {error && <p className={styles["error-message"]}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles["input-group"]}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles["reset-btn"]} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
