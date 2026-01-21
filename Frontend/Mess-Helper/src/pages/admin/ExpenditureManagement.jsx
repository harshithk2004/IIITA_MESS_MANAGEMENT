import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/ExpenditureManagement.module.css';

const ExpenditureManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        // Fetch both inventory and employees in parallel
        const [inventoryResponse, employeesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/fetch/inventory', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/fetch/employees', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Process employee data with salary
        const formattedEmployees = employeesResponse.data.map(emp => ({
          EMPLOYEE_ID: emp[0],
          NAME: emp[1],
          ROLE: emp[2],
          CONTACT: emp[3],
          EMAIL: emp[4],
          SHIFT: emp[5],
          JOINING_DATE: emp[6],
          SALARY: emp[7] || 0,
          PHOTO: emp[8]
        }));

        // Process inventory data
        const formattedInventory = inventoryResponse.data.map(item => ({
          ID: item[0],
          ITEM_NAME: item[1],
          QUANTITY: item[2],
          COST_PER_UNIT: item[3],
          TOTAL_COST: item[4] || (item[2] * item[3])
        }));

        setEmployees(formattedEmployees);
        setInventory(formattedInventory);
      } catch (error) {
        setError('Error fetching data: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalSalary = employees.reduce((sum, emp) => sum + (emp.SALARY || 0), 0);
  const totalInventory = inventory.reduce((sum, item) => sum + (item.TOTAL_COST || 0), 0);
  const grandTotal = totalSalary + totalInventory;

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Expenditure Summary</h1>

      <div className={styles.horizontalGroup}>
        {/* Inventory Section */}
        <div className={styles.section}>
          <h2>Mess Inventory</h2>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <div key={item.ID} className={styles.item}>
                <span>{item.ITEM_NAME}</span>
                <span>₹{item.TOTAL_COST?.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div className={styles.noData}>No inventory data available</div>
          )}
        </div>

        {/* Employees Section with Salary */}
        <div className={styles.section}>
          <h2>Mess Employees</h2>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div key={employee.EMPLOYEE_ID} className={styles.item}>
                <div>
                  <div className={styles.employeeName}>{employee.NAME}</div>
                  <div className={styles.employeeRole}>{employee.ROLE}</div>
                </div>
                <div className={styles.salary}>₹{employee.SALARY?.toFixed(2)}</div>
              </div>
            ))
          ) : (
            <div className={styles.noData}>No employee data available</div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className={styles.financialSummary}>
        <div className={styles.summaryItem}>
          <span>Total Salaries:</span>
          <span>₹{totalSalary.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Total Inventory:</span>
          <span>₹{totalInventory.toFixed(2)}</span>
        </div>
        <div className={styles.grandTotal}>
          <span>Grand Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenditureManagement;