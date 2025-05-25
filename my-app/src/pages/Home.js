import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import PostsList from '../components/PostList';
import { useNavigate } from 'react-router-dom';
import { FaPhotoVideo, FaRegCalendarAlt, FaSmile } from 'react-icons/fa';
import axios from 'axios';

function Home({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  // Meetup form state
  const [newMeetup, setNewMeetup] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: ''
  });

  // Show/hide meetup modal
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = () => {
    fetch('http://localhost:8081/api/posts', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
        setLoading(false);
      });
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    fetch('http://localhost:8081/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newPostContent, imageUrl: null }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create post');
        return res.json();
      })
      .then((createdPost) => {
        setPosts((prev) => [createdPost, ...prev]);
        setNewPostContent('');
      })
      .catch((err) => console.error('Failed to create post:', err));
  };

  const handleMeetupInputChange = (e) => {
    setNewMeetup({ ...newMeetup, [e.target.name]: e.target.value });
  };

  const handleCreateMeetup = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to create a meetup.");
      return;
    }

    const meetupWithUser = {
      ...newMeetup,
      createdByName: user.fullName || user.name,
      createdByEmail: user.email,
      createdByProfilePic: user.profilePic,
    };

    axios.post('http://localhost:8081/api/meetups', meetupWithUser, {
      withCredentials: true,
    })
      .then(res => {
        alert('Meetup created successfully!');
        setNewMeetup({ title: '', description: '', date: '', location: '', category: '' });
        setShowEventModal(false); // Close modal on success
      })
      .catch(() => {
        alert("Failed to create meetup.");
      });
  };

  if (!user) return null;

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.topSection}>
          {/* Post Creation Section */}
          <section className={styles.createPostContainer}>
            <div className={styles.createPostHeader}>
              <img
                src={user?.profilePic || '/default-avatar.jpg'}
                alt="User avatar"
                className={styles.createPostProfilePic}
              />
              <textarea
                className={styles.createPostInput}
                placeholder={`What's on your mind, ${user.name}?`}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />
            </div>

            <div className={styles.createPostActions}>
              <div className={styles.actionButton} onClick={() => alert('Add Photo/Video feature coming soon!')}>
                <FaPhotoVideo />
                <span>Photo/Video</span>
              </div>
              {/* Toggle event modal on click */}
              <div className={styles.actionButton} onClick={() => setShowEventModal(true)}>
                <FaRegCalendarAlt />
                <span>Event</span>
              </div>
              <div className={styles.actionButton} onClick={() => alert('Add Feeling/Activity feature coming soon!')}>
                <FaSmile />
                <span>Feeling/Activity</span>
              </div>
              <button
                className={styles.postSubmitButton}
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
              >
                Post
              </button>
            </div>
          </section>

          {/* Meetup creation modal */}
          {showEventModal && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>
                <h2>Create a New Meetup</h2>
                <form onSubmit={handleCreateMeetup} className={styles.form}>
                  <input
                    name="title"
                    value={newMeetup.title}
                    onChange={handleMeetupInputChange}
                    placeholder="Title"
                    required
                    className={styles.input}
                  />
                  <textarea
                    name="description"
                    value={newMeetup.description}
                    onChange={handleMeetupInputChange}
                    placeholder="Description"
                    required
                    className={styles.textarea}
                  />
                  <input
                    type="date"
                    name="date"
                    value={newMeetup.date}
                    onChange={handleMeetupInputChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="location"
                    value={newMeetup.location}
                    onChange={handleMeetupInputChange}
                    placeholder="Location"
                    required
                    className={styles.input}
                  />
                  <input
                    name="category"
                    value={newMeetup.category}
                    onChange={handleMeetupInputChange}
                    placeholder="Category"
                    required
                    className={styles.input}
                  />
                  <div className={styles.buttonsRow}>
                    <button
                      type="submit"
                      className={styles.createButton}
                    >
                      Create Meetup
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEventModal(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        <div className={styles.contentColumns}>
          <div className={styles.leftColumn}>
            <div className={styles.feed}>
              {loading ? (
                <p>Loading posts...</p>
              ) : (
                <PostsList posts={posts} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className={styles.rightSidebar}>
        {/* Upcoming Meetups Section */}
        <div className={styles.sidebarSection}>
          <h2>Upcoming Meetups</h2>
          <div className={styles.meetupsList}>
            <div className={styles.meetupItem}>
              <div className={styles.meetupDate}>
                <div className={styles.month}>DEC</div>
                <div className={styles.day}>15</div>
              </div>
              <div className={styles.meetupInfo}>
                <h3>Tech Innovation Summit 2024</h3>
                <p>Virtual • 10:00 AM PST</p>
                <span className={`${styles.tag} ${styles.technology}`}>Technology</span>
              </div>
            </div>

            <div className={styles.meetupItem}>
              <div className={styles.meetupDate}>
                <div className={styles.month}>DEC</div>
                <div className={styles.day}>15</div>
              </div>
              <div className={styles.meetupInfo}>
                <h3>UX Design Workshop</h3>
                <p>Virtual • 10:00 AM PST</p>
                <span className={`${styles.tag} ${styles.design}`}>Design</span>
              </div>
            </div>

            <div className={styles.meetupItem}>
              <div className={styles.meetupDate}>
                <div className={styles.month}>DEC</div>
                <div className={styles.day}>15</div>
              </div>
              <div className={styles.meetupInfo}>
                <h3>AI Innovation Summit</h3>
                <p>Virtual • 10:00 AM PST</p>
                <span className={`${styles.tag} ${styles.ai}`}>AI/ML</span>
              </div>
            </div>
          </div>
          <a href="#" className={styles.seeMoreLink}>See more events</a>
        </div>

        {/* Communities Section */}
        <div className={styles.sidebarSection}>
          <h2>Communities</h2>
          <div className={styles.communitiesList}>
            <div className={styles.communityItem}>
              <img src="/tech-hub.jpg" alt="Tech Innovators Hub" className={styles.communityImage} />
              <div className={styles.communityInfo}>
                <h3>Tech Innovators Hub</h3>
                <p>Latest: AI in Healthcare Discussion</p>
                <span className={styles.memberCount}>428 members</span>
              </div>
              <button className={styles.joinButton}>Join</button>
            </div>

            <div className={styles.communityItem}>
              <img src="/startup-founders.jpg" alt="Startup Founders Network" className={styles.communityImage} />
              <div className={styles.communityInfo}>
                <h3>Startup Founders Network</h3>
                <p>Latest: Funding Strategies 2024</p>
                <span className={styles.memberCount}>312 members</span>
              </div>
              <button className={styles.joinButton}>Join</button>
            </div>
          </div>
          <a href="#" className={styles.seeMoreLink}>See more groups</a>
        </div>
      </div>
    </div>
  );
}

export default Home;
