import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/admin/EmployeeForm.module.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    NAME: "",
    ROLE: "",
    EMAIL: "",
    PHONE: "",
    SHIFT: "Morning"
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`http://localhost:5000/api/employee/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const employeeData = {
            NAME: res.data.NAME || res.data.name || "",
            ROLE: res.data.ROLE || res.data.role || "",
            EMAIL: res.data.EMAIL || res.data.email || "",
            PHONE: res.data.CONTACT_NUMBER || res.data.phone || "",
            SHIFT: res.data.SHIFT || "Morning"
          };
          
          setFormData(employeeData);
        } catch (err) {
          console.error("Failed to fetch employee:", err);
          setErrorMessage("Failed to load employee data");
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const url = isEdit 
        ? `http://localhost:5000/api/employees-details/${id}`
        : "http://localhost:5000/api/employees-details";
      
      const method = isEdit ? "put" : "post";
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccessMessage(`Employee ${isEdit ? 'updated' : 'added'} successfully!`);
      setTimeout(() => {
        navigate('/admin/employees');
      }, 1500);
    } catch (err) {
      console.error("Failed to save employee:", err);
      setErrorMessage(err.response?.data?.message || "Failed to save employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  if (loading && isEdit) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{isEdit ? "Edit Employee" : "Add New Employee"}</h1>
      
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="NAME"
            value={formData.NAME}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Role</label>
          <select
            name="ROLE"
            value={formData.ROLE}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Cook">Cook</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Helper">Helper</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="EMAIL"
            value={formData.EMAIL}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="PHONE"
            value={formData.PHONE}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Shift</label>
          <select
            name="SHIFT"
            value={formData.SHIFT}
            onChange={handleChange}
            required
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate('/admin/employees')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                {isEdit ? "Updating..." : "Saving..."}
              </>
            ) : isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;