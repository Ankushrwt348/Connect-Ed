package com.Connect_Ed.backend.Repository;

import com.Connect_Ed.backend.Entity.Like;
import com.Connect_Ed.backend.Entity.Post;
import com.Connect_Ed.backend.Entity.UserPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(UserPost user, Post post);
}
