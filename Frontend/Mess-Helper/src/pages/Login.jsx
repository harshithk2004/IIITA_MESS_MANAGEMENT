import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login({ email, password });
    if (!result.role) {
      console.error("Login failed:", role);
      return;
    }
    if (result.role === "admin") {
      navigate("/admin/dashboard");
    } else if (result.role === "user") {
      navigate("/u/dashboard");
    } else {
      console.error("Unknown role:", role);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles["login-box"]}>
      <h2>Welcome Back!</h2>
      <p>Sign in to continue your journey with us.</p>
      {error && <p className={styles["error-message"]}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles["input-group"]}>
          <label>Email</label>
          <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles["input-group"]}>
          <label>Password</label>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles["forgot-password"]}>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className={styles["login-btn"]} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className={styles["signup-link"]}>
          New to Dashboard? <a href="/signup">Create an account</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
