import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Signup.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Enter a valid email address.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      console.log(formData);
      const response = await axios.post("http://localhost:5000/api/signup", formData);

      if (response.data.success) {
        toast.success("Signup successful!");
        localStorage.setItem("token", response.data.token);
        await login({ email: formData.email, password: formData.password });

        setTimeout(() => {
          navigate("/u/dashboard");
        }, 1500);
      } else {
        if (response.data.errors) {
          Object.values(response.data.errors).forEach((err) => toast.error(err));
        } else {
          toast.error(response.data.message || "Signup failed!");
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
          Object.values(error.response.data.errors).forEach((err) => toast.error(err));
        } else {
          toast.error(error.response.data.message || "Signup failed!");
        }
      } else {
        toast.error("Network error. Please try again!");
      }
    }
  };

  return (
    <div className={styles.signinBox}>
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.nameGroup}>
          <div className={styles.inputGroup}>
            <label>First Name</label>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            <input type="text" name="firstName" placeholder="Lorem" value={formData.firstName} onChange={handleChange} required />
            {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label>Last Name</label>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            <input type="text" name="lastName" placeholder="Ipsum" value={formData.lastName} onChange={handleChange} required />
            {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Mobile Number</label>
          <FontAwesomeIcon icon={faPhone} className={styles.icon} />
          <input type="tel" name="phoneNumber" placeholder="9876543210" value={formData.phoneNumber} onChange={handleChange} required />
          {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
          <input type="email" name="email" placeholder="lorem@example.com" value={formData.email} onChange={handleChange} required />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input type="password" name="password" placeholder="********" value={formData.password} onChange={handleChange} required />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <button type="submit" className={styles.signinBtn}>Create Account</button>

        <p className={styles.signupLink}>
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
