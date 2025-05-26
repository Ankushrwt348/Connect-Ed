import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    about: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [userEmail, setUserEmail] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [userMeetups, setUserMeetups] = useState([]);

  // Fetch user profile info
  useEffect(() => {
    axios.get("/api/user-info", { withCredentials: true })
      .then(res => {
        const data = res.data;
        setFormData({
          fullName: data.fullName || "",
          headline: data.headline || "",
          about: data.about || "",
          skills: data.skills || "",
          education: data.education || "",
          experience: data.experience || "",
          profilePictureUrl: data.profilePic || "",
        });
        setUserEmail(data.email || "");
      })
      .catch(err => {
        console.error("Error fetching user info:", err);
      });
  }, []);

  // Fetch posts and meetups after user email is available
  useEffect(() => {
    if (!userEmail) return;

    // Fetch posts created by the user
    axios.get("/api/posts", { withCredentials: true })
      .then(res => {
        const posts = res.data.filter(post => post.createdByEmail === userEmail);
        setUserPosts(posts);
      })
      .catch(err => {
        console.error("Failed to fetch posts:", err);
      });

    // Fetch meetups created by the user
    axios.get("/api/meetups", { withCredentials: true })
      .then(res => {
        const meetups = res.data.filter(meetup => meetup.createdByEmail === userEmail);
        setUserMeetups(meetups);
      })
      .catch(err => {
        console.error("Failed to fetch meetups:", err);
      });
  }, [userEmail]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/user/profile", formData, { withCredentials: true });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      // If profile updated anyway, maybe ignore error or handle gracefully
      console.error("Profile update failed (but may have succeeded):", err);
      alert("Profile update failed, but changes may have been saved.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.coverImage}>
          <img src="/cover-background.jpg" alt="Cover" />
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profilePicture}>
              <img src={formData.profilePictureUrl || "/default-profile.jpg"} alt="Profile" />
            </div>
            <button onClick={() => setIsEditing(true)} className={styles.editButton}>
              <span className={styles.editIcon}>✏️</span>
            </button>
          </div>

          <div className={styles.profileInfo}>
            <h2>{formData.fullName}</h2>
            <p className={styles.headline}>{formData.headline}</p>
            <p className={styles.location}>Delhi, India</p>
            <div className={styles.stats}>
              <span>0 followers</span>
              <span>·</span>
              <span>0 connections</span>
            </div>
            <div className={styles.education}>
            <p>{formData.education || "Education"}</p>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.detailSection}>
              <h3>About</h3>
              <p>{formData.about || "Add a summary about yourself"}</p>
            </div>
            <div className={styles.detailSection}>
              <h3>Skills</h3>
              <p>{formData.skills || "Add your skills"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className={styles.contentSection}>
        <section className={styles.section}>
          <h3>Your Posts</h3>
          {userPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <ul className={styles.list}>
              {userPosts.map(post => (
                <li key={post.id} className={styles.card}>
                  <p>{post.content}</p>
                  <small>{new Date(post.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Meetups Section */}
        <section className={styles.section}>
          <h3>Your Meetups</h3>
          {userMeetups.length === 0 ? (
            <p>No meetups created.</p>
          ) : (
            <ul className={styles.list}>
              {userMeetups.map(meetup => (
                <li key={meetup.id} className={styles.card}>
                  <h4>{meetup.title}</h4>
                  <p>{meetup.description}</p>
                  <small>{new Date(meetup.date).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className={styles.closeButton}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              {["fullName", "headline", "about", "skills", "education", "experience"].map(field => (
                <div key={field} className={styles.field}>
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {(field === "about" || field === "experience" || field === "education") ? (
                    <textarea
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      rows={field === "about" ? 4 : 3}
                      required
                    />
                  ) : (
                    <input
                      id={field}
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>
              ))}
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancel</button>
                <button type="submit" className={styles.submitButton}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

