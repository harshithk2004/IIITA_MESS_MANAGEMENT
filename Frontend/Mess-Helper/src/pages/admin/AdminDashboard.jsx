import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Dashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faCommentDots,
  faUtensils,
  faClipboardList,
  faBell,
  faMoneyBillWave,
  faBoxes
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = ({ children }) => {
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
          <li onClick={() => navigate("/admin/menu/edit")}>
            <FontAwesomeIcon icon={faClipboardList} className={styles.icon} />
            <span>Edit Menu</span>
          </li>
          <li onClick={() => navigate("/admin/feedback")}>
            <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
            <span>Feedback</span>
          </li>
          <li onClick={() => navigate("/admin/rebate/approval")}>
            <FontAwesomeIcon icon={faUtensils} className={styles.icon} />
            <span>Mess Rebate</span>
          </li>
          <li onClick={() => navigate("/admin/expenditure")}>
            <FontAwesomeIcon icon={faMoneyBillWave} className={styles.icon} />
            <span>Expense Management</span>
          </li>
          <li onClick={() => navigate("/admin/inventory")}>
            <FontAwesomeIcon icon={faBoxes} className={styles.icon} />
            <span>Mess Inventory</span>
          </li>
          <li onClick={() => navigate("/admin/employees")} className={styles.active}>
            <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
            <span>Employee Profile</span>
          </li>
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

export default AdminDashboard;
