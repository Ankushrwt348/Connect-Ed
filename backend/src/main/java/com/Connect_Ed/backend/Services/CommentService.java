package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.Comment;
import com.Connect_Ed.backend.Entity.Post;
import com.Connect_Ed.backend.Entity.UserPost;
import com.Connect_Ed.backend.Repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment addComment(UserPost user, Post post, String text, Comment parentComment) {
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setParentComment(parentComment);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsForPost(Post post) {
        return commentRepository.findByPost(post);
    }
}


