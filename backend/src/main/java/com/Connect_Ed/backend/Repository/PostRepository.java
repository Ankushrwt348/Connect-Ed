package com.Connect_Ed.backend.Repository;

import com.Connect_Ed.backend.Entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p JOIN FETCH p.user ORDER BY p.createdAt DESC")
    List<Post> findAllPostsWithUser();
    List<Post> findByCreatedByEmail(String email);
}
