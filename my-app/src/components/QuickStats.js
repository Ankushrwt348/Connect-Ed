import React from "react";
import styles from "./styles/QuickStats.module.css";

const QuickStats = () => {
  return (
    <div className={styles.quickStats}>
      <h2>Quick Stats</h2>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.number}>1.2K</span>
          <span>Post Views</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>85%</span>
          <span>Profile Growth</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>45</span>
          <span>New Connections</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>12</span>
          <span>Pending Invites</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;