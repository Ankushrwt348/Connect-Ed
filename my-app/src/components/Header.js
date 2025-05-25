import React from "react";
import styles from "./styles/Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>🌐 CONNECT-ED</div>
      <nav className={styles.nav}>
        <a href="#home">Home</a>
        <a href="#meetups">Meetups</a>
        <a href="#communities">Communities</a>
        <a href="#network">Network</a>
      </nav>
      <div className={styles.search}>
        <input type="text" placeholder="Search people, posts, or events..." />
      </div>
      <button className={styles.signIn}>Sign In</button>
    </header>
  );
};

export default Header;