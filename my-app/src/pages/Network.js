import React, { useEffect, useState } from 'react';
import styles from '../styles/Network.module.css';

function Network() {
  const [connectedMembers, setConnectedMembers] = useState([]);
  const [recommendedConnections, setRecommendedConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch connected and recommended users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const connectedRes = await fetch('/connected');
        const recommendedRes = await fetch('/recommended');

        const connectedData = await connectedRes.json();
        const recommendedData = await recommendedRes.json();

        setConnectedMembers(connectedData);
        setRecommendedConnections(recommendedData);
      } catch (error) {
        console.error('Error fetching network data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Connect button click
  const handleConnect = async (connectUserId) => {
    try {
      const res = await fetch(`/connect/${connectUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        alert('Connected successfully!');
        // Refresh recommended + connected lists
        const refreshedConnected = await fetch('/connected').then(r => r.json());
        const refreshedRecommended = await fetch('/recommended').then(r => r.json());
        setConnectedMembers(refreshedConnected);
        setRecommendedConnections(refreshedRecommended);
      } else {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.network}>
      <h1>Network</h1>
      <p className={styles.subtitle}>
        Connect with professionals and expand your professional network
      </p>

      <section className={styles.connectedSection}>
        <h2>Connected Members ({connectedMembers.length})</h2>
        <div className={styles.membersGrid}>
          {connectedMembers.map(member => (
            <div key={member.id} className={styles.memberCard}>
              <img src={member.profilePic || '/default-avatar.png'} alt={member.name} className={styles.profileImage} />
              <div className={styles.memberInfo}>
                <h3>{member.name}</h3>
                <p>{member.role || 'Student'}</p>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.viewMore}>View more</button>
      </section>

      <section className={styles.recommendedSection}>
        <h2>Recommended Connections</h2>
        <div className={styles.recommendedGrid}>
          {recommendedConnections.map(connection => (
            <div key={connection.id} className={styles.recommendedCard}>
              <img src={connection.profilePic || '/default-avatar.png'} alt={connection.name} className={styles.profileImage} />
              <h3>{connection.name}</h3>
              <p>{connection.role || 'Alumni'}</p>
              <button className={styles.connectButton} onClick={() => handleConnect(connection.id)}>Connect</button>
            </div>
          ))}
        </div>
        <button className={styles.viewMore}>View more</button>
      </section>
    </div>
  );
}

export default Network;
