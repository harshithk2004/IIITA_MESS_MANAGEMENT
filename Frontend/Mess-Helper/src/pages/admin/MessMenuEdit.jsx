import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/MessMenu.module.css";
import { useAuth } from "../../context/AuthContext";

const MessMenuEdit = () => {
  const [timings, setTimings] = useState([]);
  const [menu, setMenu] = useState([]);
  const [editedMenu, setEditedMenu] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

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

        setTimings(timingsResponse.data.timings || []);
        const organizedMenu = organizeMenuByDay(menuResponse.data.menu || []);
        setMenu(organizedMenu);
        setEditedMenu(organizedMenu); // Initialize editedMenu also
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load mess data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (dayIndex, mealType, value) => {
    const updatedMenu = [...editedMenu];
    updatedMenu[dayIndex][mealType] = value;
    setEditedMenu(updatedMenu);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');

      for (const dayMenu of editedMenu) {
        for (const mealType of ["breakfast", "lunch", "dinner"]) {
          const newValue = dayMenu[mealType];
          await axios.put(`http://localhost:5000/api/mess-menu-edit`, {
            day_of_week: dayMenu.day_of_week,
            meal_type: mealType,
            new_items: newValue
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }

      setMenu(editedMenu); // Update frontend
      setIsEditing(false);
      alert("Menu updated successfully!");

    } catch (error) {
      console.error("Failed to update menu", error);
      alert("Failed to update menu. Try again!");
    }
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

      {/* Meal Timings */}
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

      {/* Weekly Menu */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Weekly Menu</h2>

        <div className={styles.actionButtons}>
          {isEditing ? (
            <button className={styles.saveButton} onClick={handleSaveClick}>Save</button>
          ) : (
            <button className={styles.editButton} onClick={handleEditClick}>Edit Menu</button>
          )}
        </div>

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
              {menu.map((day, dayIndex) => (
                <tr key={`menu-${dayIndex}`}>
                  <td>{day.day_of_week}</td>
                  {["breakfast", "lunch", "dinner"].map(meal => (
                    <td key={meal}>
                      {isEditing ? (
                        <input
                          className={styles.input}
                          value={editedMenu[dayIndex][meal]}
                          onChange={(e) => handleInputChange(dayIndex, meal, e.target.value)}
                        />
                      ) : (
                        day[meal] || "Not available"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MessMenuEdit;
