package com.Connect_Ed.backend.Services;


import com.Connect_Ed.backend.Entity.Post;
import com.Connect_Ed.backend.Entity.UserPost;
import com.Connect_Ed.backend.Repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(UserPost user, String content, String imageUrl) {
        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllPostsWithUser();
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
