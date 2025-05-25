import React, { useState, useEffect } from 'react';
import styles from '../styles/Post.module.css';

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // New state for like count
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (showComments) {
      setCommentsLoading(true);
      fetch(`http://localhost:8081/api/comments/${post.id}`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          const extractedComments = Array.isArray(data) ? data : data.comments;
          if (!Array.isArray(extractedComments)) {
            throw new Error('Invalid comments format');
          }
          setComments(extractedComments);
        })
        .catch(err => {
          console.error('Failed to fetch comments:', err);
          setComments([]);
        })
        .finally(() => setCommentsLoading(false));
    }
  }, [showComments, post.id]);

  // New effect: fetch like count when component mounts
  useEffect(() => {
    fetch(`http://localhost:8081/api/likes/count/${post.id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(count => setLikeCount(count))
      .catch(err => {
        console.error('Failed to fetch like count:', err);
      });
  }, [post.id]);

  const handleToggleComments = () => {
    setShowComments(prev => !prev);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    fetch(`http://localhost:8081/api/comments/${post.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add comment');
        return res.json();
      })
      .then(addedComment => {
        setComments(prev => [...prev, addedComment]);
        setNewComment('');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to add comment. Please try again.');
      });
  };

  // Updated toggleLike function to call correct backend and update likeCount
  const toggleLike = () => {
    if (likeLoading) return; // prevent multiple clicks
    setLikeLoading(true);

    fetch(`http://localhost:8081/api/likes/${post.id}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update like');
        return res.json();
      })
      .then(data => {
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to update like. Please try again.');
      })
      .finally(() => setLikeLoading(false));
  };

  console.log('Post profilePic:', post.profilePic);
  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <img src={post.profilePic} alt={post.user} className={styles.profilePic} />

        <div>
          <h3>{post.user}</h3>
          <p>{post.role}</p>
          <span>{post.time}</span>
        </div>
      </div>

      <p>{post.content}</p>

      {post.postImage && (
        <img src={post.profilePic} alt={post.user} className={styles.profilePic} />
      )}

      <div className={styles.actions}>
        <button
          onClick={toggleLike}
          className={styles.likeButton}
          aria-label="Like post"
          disabled={likeLoading}
        >
          {liked ? '❤️' : '🤍'}
        </button>

        {/* NEW: Show like count here */}
        <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>

        <button onClick={handleToggleComments}>
          {showComments ? 'Hide Comments' : 'Comment'}
        </button>

        <button>Share</button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          <div className={styles.addComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              disabled={commentsLoading}
            />
            <button onClick={handleAddComment} disabled={commentsLoading}>
              Comment
            </button>
          </div>

          <div className={styles.commentsList}>
            {commentsLoading ? (
              <p>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map(comment => {
                console.log('Rendering comment:', comment);

                return (
                  <div key={comment.id} className={styles.comment}>
                    <img
                      src={comment.user?.profileImage || '/default-avatar.jpg'}
                      alt={comment.user?.name || 'Anonymous'}
                      className={styles.commentProfilePic}
                    />
                    <strong>{comment.user?.name || 'Anonymous'}:</strong> {comment.text}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
