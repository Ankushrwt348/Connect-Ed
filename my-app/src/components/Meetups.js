import React from "meet";
import styles from "./styles/Meetups.module.css";

const Meetups = ({ meetups }) => {
  return (
    <div className={styles.meetups}>
      <h2>Upcoming Meetups</h2>
      {meetups.map((meetup, index) => (
        <div key={index} className={styles.meetup}>
          <h3>{meetup.title}</h3>
          <p>{meetup.date}</p>
          <p>{meetup.type} | {meetup.category}</p>
          <button>Register Now</button>
        </div>
      ))}
      <a href="#more">See more events</a>
    </div>
  );
};

export default Meetups;