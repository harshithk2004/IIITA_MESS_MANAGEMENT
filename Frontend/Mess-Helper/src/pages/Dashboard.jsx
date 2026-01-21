import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Dashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faCommentDots,
  faUtensils,
  faClipboardList,
  faBell
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <ul>
          <li onClick={() => navigate("/u/menu")}>
            <FontAwesomeIcon icon={faClipboardList} className={styles.icon} />
            <span>Menu</span>
          </li>
          <li onClick={() => navigate("/u/feedback")}>
            <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
            <span>Feedback</span>
          </li>
          <li onClick={() => navigate("/u/mess/rebate")}>
            <FontAwesomeIcon icon={faUtensils} className={styles.icon} />
            <span>Mess Rebate</span>
          </li>
          <li onClick={() => navigate("/u/profile")} className={styles.active}>
            <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
            <span>User Profile</span>
          </li>

          {/* <li >
          <FontAwesomeIcon icon={faBell} className={styles.icon} />
          <span>Announcements</span>
        </li> */}


          <li>
            <button onClick={logout} className={styles.logoutBtn}>
              <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
            </button>
          </li>
          
        </ul>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;