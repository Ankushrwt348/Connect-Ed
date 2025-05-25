import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/AdminDashboard.module.css';

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/admin/pending-users', { withCredentials: true });
      setPendingUsers(response.data);

      const [communitiesRes, meetupsRes] = await Promise.all([
        axios.get('http://localhost:8081/api/admin/communities', { withCredentials: true }),
        axios.get('http://localhost:8081/api/admin/meetups', { withCredentials: true }),
      ]);

      setCommunities(communitiesRes.data);
      setMeetups(meetupsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, action) => {
    try {
      await axios.post(`http://localhost:8081/api/admin/${action}/${userId}`, {}, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error(`Error during ${action} for user ${userId}:`, error);
    }
  };

  const handleVerification = async (id, type, action) => {
    try {
      await axios.post(`http://localhost:8081/api/admin/${type}/${action}/${id}`, {}, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error(`Error during ${action} for ${type} ${id}:`, error);
    }
  };

  if (loading) return <p className={styles.loading}>Loading data, please wait...</p>;

  return (
    <div className={styles.adminDashboard}>
      <h1>Admin Dashboard</h1>

      <section className={styles.section}>
        <h2>Pending User Approvals</h2>
        {pendingUsers.length === 0 ? (
          <p className={styles.empty}>No pending users to review.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className={styles.approve} onClick={() => handleApproval(user.id, 'approve')}>
                      Approve
                    </button>
                    <button className={styles.reject} onClick={() => handleApproval(user.id, 'reject')}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.section}>
        <h2>Community Verification</h2>
        {communities.length === 0 ? (
          <p className={styles.empty}>No communities found to verify.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Community Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {communities.map(community => (
                <tr key={community.id}>
                  <td>{community.name}</td>
                  <td>{community.description}</td>
                  <td>
                    <span className={`${styles.status} ${styles[community.status.toLowerCase()]}`}>
                      {community.status}
                    </span>
                  </td>
                  <td>
                    {community.status === 'Pending' ? (
                      <button
                        className={styles.verify}
                        onClick={() => handleVerification(community.id, 'community', 'verify')}
                      >
                        Verify
                      </button>
                    ) : (
                      <button
                        className={styles.view}
                        onClick={() => handleVerification(community.id, 'community', 'view')}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.section}>
        <h2>Meetup Verification</h2>
        {meetups.length === 0 ? (
          <p className={styles.empty}>No meetups pending verification.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Meetup Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetups.map(meetup => (
                <tr key={meetup.id}>
                  <td>{meetup.title}</td>
                  <td>{meetup.date}</td>
                  <td>{meetup.location}</td>
                  <td>
                    <span className={`${styles.status} ${styles[meetup.status.toLowerCase()]}`}>
                      {meetup.status}
                    </span>
                  </td>
                  <td>
                    {meetup.status === 'Pending' ? (
                      <button
                        className={styles.verify}
                        onClick={() => handleVerification(meetup.id, 'meetup', 'verify')}
                      >
                        Verify
                      </button>
                    ) : (
                      <button
                        className={styles.view}
                        onClick={() => handleVerification(meetup.id, 'meetup', 'view')}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
