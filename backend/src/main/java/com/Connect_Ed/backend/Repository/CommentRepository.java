package com.Connect_Ed.backend.Repository;


import com.Connect_Ed.backend.Entity.Comment;
import com.Connect_Ed.backend.Entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);

}