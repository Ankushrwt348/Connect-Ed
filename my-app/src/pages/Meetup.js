import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Meetups.module.css';

function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api/meetups')
      .then(response => {
        setMeetups(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching meetups:', error);
        setError('Failed to load meetups.');
        setLoading(false);
      });
  }, []);

  const handleJoin = (title) => {
    alert(`You clicked Join for "${title}". Functionality coming soon!`);
  };

  if (loading) return <div className={styles.loading}>Loading meetups...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <main className={styles.meetupsPage}>
      <header className={styles.header}>
        <h1>Upcoming Meetups</h1>
        <p>Join our exciting events and connect with community members</p>
      </header>

      <section className={styles.meetupsGrid}>
        {meetups.map((meetup) => (
          <article key={meetup.id} className={styles.meetupCard}>
            <div className={styles.cardHeader}>
              <span className={`${styles.category} ${styles[meetup.category?.toLowerCase() || 'default']}`}>
                {meetup.category || 'General'}
              </span>
              <time className={styles.date} dateTime={meetup.date}>
                {meetup.date || 'Date TBA'}
              </time>
            </div>

            <h2>{meetup.title}</h2>
            <p className={styles.description}>{meetup.description}</p>

            <div className={styles.organizer}>
              <img 
                src={meetup.organizer?.avatar || '/default-avatar.png'} 
                alt={meetup.organizer?.name || 'Organizer'} 
                className={styles.organizerAvatar}
              />
              <div className={styles.organizerInfo}>
                <h3>{meetup.organizer?.name || 'Unknown Organizer'}</h3>
                <p>{meetup.organizer?.title || ''}</p>
              </div>
            </div>

            <div className={styles.location}>
              <i className="location-icon" aria-hidden="true"></i>
              <span>{meetup.location || 'Location TBA'}</span>
            </div>

            <button 
              className={styles.joinButton} 
              onClick={() => handleJoin(meetup.title)}
            >
              Join Event
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Meetups;
