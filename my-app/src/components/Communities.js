import React from "react";
import styles from "./styles/Communities.module.css";

const Communities = ({ communities }) => {
  return (
    <div className={styles.communities}>
      <h2>Communities</h2>
      {communities.map((community, index) => (
        <div key={index} className={styles.community}>
          <img src={community.image} alt={community.name} className={styles.communityImage} />
          <div>
            <h3>{community.name}</h3>
            <p>{community.members} members</p>
            <p>{community.latest}</p>
            <button>Join</button>
          </div>
        </div>
      ))}
      <a href="#more">See more groups</a>
    </div>
  );
};

export default Communities;