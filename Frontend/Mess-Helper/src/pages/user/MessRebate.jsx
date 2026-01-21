import React, { useState } from 'react';
import styles from '../../styles/MessRebate.module.css';
import axios from 'axios';

const MessRebate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enroll: '',
    branch: '',
    hostel: '',
    dates: [{ startDate: '', endDate: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData) {    // 🛡️ safer update
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (index, e) => {
    const { name, value } = e.target;
    const newDates = [...formData.dates];
    newDates[index][name] = value;
    setFormData(prev => ({
      ...prev,
      dates: newDates
    }));
  };

  const addDateRange = () => {
    setFormData(prev => ({
      ...prev,
      dates: [...prev.dates, { startDate: '', endDate: '' }]
    }));
  };

  const removeDateRange = (index) => {
    const newDates = [...formData.dates];
    newDates.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      dates: newDates
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/mess/rebate', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log(response.data);

      if (response) {
        alert('Form submitted successfully!');
        setFormData({
          name: '',
          email: '',
          enroll: '',
          branch: '',
          hostel: '',
          dates: [{ startDate: '', endDate: '' }]
        }); 
      } else {
        alert('Submission failed.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Mess Rebate Application</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Lorem Ipsum"
            required 
          />
        </div>

        <div className={styles.section}>
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="lorem@example.com"
            required 
          />
        </div>

        <div className={styles.section}>
          <label>Enrollment Number</label>
          <input 
            type="text" 
            name="enroll" 
            value={formData.enroll} 
            onChange={handleChange} 
            placeholder="IIT2023178"
            required 
          />
        </div>

        <div className={styles.section}>
          <label>Branch</label>
          <select 
            name="branch" 
            value={formData.branch} 
            onChange={handleChange} 
            required
          >
            <option value="" disabled>Select your branch</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
          </select>
        </div>

        <div className={styles.section}>
          <label>Hostel</label>
          <select 
            name="hostel" 
            value={formData.hostel} 
            onChange={handleChange} 
            required
          >
            <option value="" disabled>Select your hostel</option>
            <option value="BH-1">BH-1</option>
            <option value="BH-2">BH-2</option>
            <option value="BH-3">BH-3</option>
            <option value="BH-4">BH-4</option>
          </select>
        </div>

        <div className={styles.datesSection}>
          <h2>Rebate Date(s)</h2>
          {formData.dates.map((date, index) => (
            <div key={index} className={styles.dateRange}>
              <div className={styles.section}>
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={date.startDate} 
                  onChange={(e) => handleDateChange(index, e)} 
                  required 
                />
              </div>
              <div className={styles.section}>
                <label>End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={date.endDate} 
                  onChange={(e) => handleDateChange(index, e)} 
                  required 
                />
              </div>
              {index !== 0 && (
                <button 
                  type="button" 
                  className={styles.removeBtn} 
                  onClick={() => removeDateRange(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            className={styles.addBtn} 
            onClick={addDateRange}
          >
            Add More Dates
          </button>
        </div>

        <button className={styles.submitBtn} type="submit">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default MessRebate;
