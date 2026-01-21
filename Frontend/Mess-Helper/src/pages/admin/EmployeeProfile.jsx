import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/admin/EmployeeProfile.module.css";
import { useAuth } from "../../context/AuthContext";

const EmployeeProfile = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  const fetchEmployees = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = query
        ? `http://localhost:5000/api/employees-details/search?query=${query}`
        : "http://localhost:5000/api/employees-details";
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const employeeData = Array.isArray(res.data?.employees) 
        ? res.data.employees.map(emp => ({
            EMP_ID: emp.EMP_ID || emp.emp_id || emp[0],
            NAME: emp.NAME || emp.name || emp[1],
            ROLE: emp.ROLE || emp.role || emp[2],
            PHONE: emp.PHONE || emp.phone || emp[3],
            EMAIL: emp.EMAIL || emp.email || emp[4],
            SHIFT: emp[5],
            JOIN_DATE: emp.JOIN_DATE || emp[6] || new Date().toISOString()
          }))
        : [];

      setEmployees(employeeData);
      
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchEmployees();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchQuery);
  };

  const handleAddEmployee = () => {
    navigate('/admin/employees/new');
  };

  const handleEditEmployee = (employee) => {
    navigate(`/admin/employees/edit/${employee.EMP_ID}`);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/employees-details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees(searchQuery);
    } catch (err) {
      console.error("Failed to delete employee:", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Employee Management</h1>
        <div className={styles.controls}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by name, email or role..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              <i className="fas fa-search"></i>
            </button>
          </form>
          <button className={styles.addButton} onClick={handleAddEmployee}>
            <i className="fas fa-plus"></i> Add Employee
          </button>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Total Employees</h3>
          <p>{employees.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Morning Shift</h3>
          <p>{employees.filter(e => e.SHIFT === 'Morning').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Evening Shift</h3>
          <p>{employees.filter(e => e.SHIFT === 'Evening').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Night Shift</h3>
          <p>{employees.filter(e => e.SHIFT === 'Night').length}</p>
        </div>
      </div>

      <div className={styles.employeeGrid}>
        {employees.length > 0 ? (
          employees.map((emp) => (
            <div key={emp.EMP_ID} className={styles.employeeCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {getInitials(emp.NAME)}
                </div>
                <div className={styles.nameRole}>
                  <h3>{emp.NAME}</h3>
                  <span className={styles.roleBadge}>{emp.ROLE}</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span>{emp.EMAIL}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Phone:</span>
                  <span>{emp.PHONE}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Shift:</span>
                  <span className={`${styles.shiftBadge} ${
                    emp.SHIFT === 'Morning' ? styles.morningShift : 
                    emp.SHIFT === 'Evening' ? styles.eveningShift : styles.nightShift
                  }`}>
                    {emp.SHIFT}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Joined:</span>
                  <span>{new Date(emp.JOIN_DATE).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleEditEmployee(emp)}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleDeleteEmployee(emp.EMP_ID)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <i className="fas fa-users-slash"></i>
            </div>
            <h3>No employees found</h3>
            <p>Try adjusting your search or add a new employee</p>
            <button className={styles.addButton} onClick={handleAddEmployee}>
              <i className="fas fa-plus"></i> Add Employee
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;