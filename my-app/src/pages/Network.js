import React from 'react';
import styles from '../styles/Network.module.css';

const connectedMembers = [
  {
    id: 1,
    name: 'Srishti Kapoor',
    period: '2022-Present',
    profilePic: 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
  },
  {
    id: 2,
    name: 'Shruti Arora',
    period: '2018-2022',
    role: 'Senior Consultant at EY',
    profilePic: 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
  },
  {
    id: 3,
    name: 'Akhil Sharma',
    period: '2013-2017',
    role: 'Senior Developer at Tech Mahindra',
    profilePic: 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
  },
  // Add more members as needed
];

const recommendedConnections = [
  {
    id: 1,
    name: 'Dhruv Shah',
    role: 'Senior Developer at Tech Solutions',
    profilePic: 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
  },
  // Add more recommended connections as needed
];

function Network() {
  return (
    <div className={styles.network}>
      <h1>Network</h1>
      <p className={styles.subtitle}>
        Connect with professionals and expand your professional network
      </p>

      <div className={styles.section}>
        <h2>Connected Members (29)</h2>
        <div className={styles.membersGrid}>
          {connectedMembers.map(member => (
            <div key={member.id} className={styles.memberCard}>
              <img 
                src={member.profilePic} 
                alt={member.name} 
                className={styles.avatar} 
              />
              <div className={styles.memberInfo}>
                <h3>{member.name}</h3>
                <p className={styles.period}>{member.period}</p>
                {member.role && <p className={styles.role}>{member.role}</p>}
              </div>
            </div>
          ))}
        </div>
        <button className={styles.viewMore}>View more (16)</button>
      </div>

      <div className={styles.section}>
        <h2>Recommended Connections</h2>
        <div className={styles.recommendedGrid}>
          {recommendedConnections.map(connection => (
            <div key={connection.id} className={styles.recommendedCard}>
              <img 
                src={connection.profilePic} 
                alt={connection.name} 
                className={styles.avatar} 
              />
              <h3>{connection.name}</h3>
              <p className={styles.role}>{connection.role}</p>
              <button className={styles.connectButton}>Connect</button>
            </div>
          ))}
        </div>
        <button className={styles.viewMore}>View more (15)</button>
      </div>
    </div>
  );
}

export default Network;