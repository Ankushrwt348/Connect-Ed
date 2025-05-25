import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Meetups.module.css';

function Meetups({ user }) {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError('Please log in to view meetups.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8081/api/meetups', { withCredentials: true })
      .then(response => {
        setMeetups(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load meetups.');
        setLoading(false);
      });
  }, [user]);

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
              <span className={`${styles.category} ${styles[meetup.category?.toLowerCase().replace('/', '') || 'default']}`}>
                {meetup.category || 'Technology'}
              </span>
              <time className={styles.date}>
                {new Date(meetup.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>

            <h2>{meetup.title}</h2>
            <p className={styles.description}>{meetup.description}</p>

            <div className={styles.organizer}>
              <img
                src={meetup.createdByProfilePic || '/default-avatar.png'}
                alt={meetup.createdByName}
                className={styles.organizerAvatar}
              />
              <div className={styles.organizerInfo}>
                <h3>{meetup.createdByName}</h3>
                <p>{meetup.createdByTitle || 'Event Organizer'}</p>
              </div>
            </div>

            <div className={styles.location}>
              📍 {meetup.location}
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
