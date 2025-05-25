import React from 'react';
import Post from './Post';

const PostsList = ({ posts }) => {
  if (!posts.length) return <p>No posts found.</p>;
  return (
    <div>
      {posts.map(post => (
        <Post
          key={post.id}
          post={{
            id: post.id,
            user: post.user?.name || "Unknown User",        // ✅ FIXED
            role: post.user?.role || "",
            profilePic: post.user?.profileImage || "/default-avatar.jpg",  // ✅ FIXED
            content: post.content,
            postImage: post.imageUrl,
            time: new Date(post.createdAt).toLocaleString(),
            likes: post.likesCount || 0,
            comments: post.commentsCount || 0,
            shares: post.sharesCount || 0,
          }}
        />
      ))}
    </div>
  );
};

export default PostsList;
