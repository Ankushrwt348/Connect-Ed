package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.Like;
import com.Connect_Ed.backend.Entity.Post;
import com.Connect_Ed.backend.Entity.UserPost;
import com.Connect_Ed.backend.Repository.LikeRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public Like toggleLike(UserPost user, Post post) {
        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);
        if (existingLike.isPresent()) {
            Like like = existingLike.get();
            like.setLiked(!like.isLiked()); // toggle
            return likeRepository.save(like);
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            like.setLiked(true);
            return likeRepository.save(like);
        }
    }
}

