import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/Profile.module.css";
import Dashboard from "../Dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserCircle, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
        console.log(data);
        setUserData({
          firstName: data.FIRSTNAME || "",
          lastName: data.LASTNAME || "",
          email: data.EMAIL || "",
          phone: data.PHONENUMBER || "",
          street: data.STREET || "",
          city: data.CITY || "",
          state: data.STATE|| ""
        });
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put("http://localhost:5000/api/user/profile_update", 
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          street: userData.street,
          city: userData.city,
          state: userData.state
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log(response);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error("Update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;
  if (isLoading) return <div>Loading profile data...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <Dashboard>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile Settings</h1>
          {!isEditing ? (
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </button>
          ) : (
            <div className={styles.editActions}>
              <button className={`${styles.editButton} ${styles.cancelButton}`} 
                onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className={`${styles.editButton} ${styles.saveButton}`} 
                onClick={handleSave}
                disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2><FontAwesomeIcon icon={faUserCircle} /> Personal Information</h2>
          <div className={styles.grid}>
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? styles.readOnlyInput : ""}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? styles.readOnlyInput : ""}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                readOnly
                className={styles.readOnlyInput}
              />
            </div>
            <div>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? styles.readOnlyInput : ""}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2><FontAwesomeIcon icon={faClipboardList} /> Address Details</h2>
          <div className={styles.grid}>
            <div className={styles.fullWidth}>
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={userData.street}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? styles.readOnlyInput : ""}
              />
            </div>
            <div>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={userData.city}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? styles.readOnlyInput : ""}
              />
            </div>
            <div>
              <label>State</label>
              <input
                type="text"
                name="state"
                value={userData.state}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? styles.readOnlyInput : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Profile;