import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>Page Not Found</h2>
        <p className={styles.errorMessage}>
          Oops! Looks like this page has wandered off into the digital void.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className={styles.homeButton}
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;