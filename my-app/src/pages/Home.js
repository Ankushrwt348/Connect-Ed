import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import PostsList from '../components/PostList';
import { useNavigate } from 'react-router-dom';

function Home({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  // ⛔ Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // ✅ Fetch posts after confirming user is logged in
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
    if (!newPostContent.trim()) return;  // <-- if empty, just return and do nothing

    fetch('http://localhost:8081/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newPostContent, imageUrl: null }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create post');  // <-- if error, will throw
        return res.json();
      })
      .then((createdPost) => {
        setPosts((prev) => [createdPost, ...prev]);
        setNewPostContent('');
      })
      .catch((err) => console.error('Failed to create post:', err));
  };
  if (!user) return null; // Prevents flicker before redirect happens

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.topSection}>
          <section className={styles.createPost}>
            <div className={styles.postInput}>
              <img
                src={user?.profileImage || '/default-avatar.jpg'}
                alt="User avatar"
                className={styles.userAvatar}
              />
              <input
                type="text"
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreatePost();
                  }
                }}
              />
            </div>
            <div className={styles.postActions}>
              <button onClick={handleCreatePost}>Post</button>
            </div>
          </section>
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
    </div>
  );
}

export default Home;
