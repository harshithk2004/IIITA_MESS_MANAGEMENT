import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/MessMenu.module.css";
import { useAuth } from "../../context/AuthContext";

const MessMenu = () => {
  const [timings, setTimings] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    if (!user) {
      return <p>Loading Mess details...</p>;
    }
  
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token=localStorage.getItem('token');
        const [timingsResponse, menuResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/mess-timings", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get("http://localhost:5000/api/mess-menu", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        console.log(timingsResponse,menuResponse);
        setTimings(timingsResponse.data.timings || []);
        const organizedMenu = organizeMenuByDay(menuResponse.data.menu || []);
        setMenu(organizedMenu);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load mess data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const organizeMenuByDay = (menuItems) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(day => {
      const dayMenu = { day_of_week: day };
      menuItems
        .filter(item => item.day_of_week === day)
        .forEach(item => {
          dayMenu[item.meal_type.toLowerCase()] = item.items || "Not available";
        });
      return dayMenu;
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading mess information...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Mess Portal</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Meal Timings</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Meal Type</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {timings.map((time, index) => (
                <tr key={`timing-${index}`}>
                  <td>{time.meal_type}</td>
                  <td>{time.start_time}</td>
                  <td>{time.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Weekly Menu</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((day, index) => (
                <tr key={`menu-${index}`}>
                  <td>{day.day_of_week}</td>
                  <td>{day.breakfast || "Not available"}</td>
                  <td>{day.lunch || "Not available"}</td>
                  <td>{day.dinner || "Not available"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MessMenu;