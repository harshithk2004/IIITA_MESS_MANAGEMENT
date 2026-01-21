import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/ResetPassword.module.css"; 
const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token:", token);

    const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    alert(data.success || data.error);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
