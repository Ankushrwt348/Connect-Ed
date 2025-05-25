package com.Connect_Ed.backend.Controller;

import com.Connect_Ed.backend.Entity.Comment;
import com.Connect_Ed.backend.Entity.DTO.CommentRequest;
import com.Connect_Ed.backend.Entity.Post;
import com.Connect_Ed.backend.Entity.UserPost;
import com.Connect_Ed.backend.Repository.CommentRepository;
import com.Connect_Ed.backend.Repository.PostRepository;
import com.Connect_Ed.backend.Services.CommentService;
import com.Connect_Ed.backend.Services.UserPostService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommentController {

    private final CommentService commentService;
    private final UserPostService userPostService;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public CommentController(CommentService commentService, UserPostService userPostService,
                             PostRepository postRepository, CommentRepository commentRepository) {
        this.commentService = commentService;
        this.userPostService = userPostService;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    @PostMapping("/{postId}")
    public Comment addComment(@PathVariable Long postId,
                              @RequestBody CommentRequest commentRequest,
                              Principal principal) {
        UserPost user = userPostService.getOrCreateGoogleUser(principal);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        Comment parentComment = (commentRequest.getParentCommentId() != null)
                ? commentRepository.findById(commentRequest.getParentCommentId()).orElse(null)
                : null;

        return commentService.addComment(user, post, commentRequest.getContent(), parentComment);
    }

    @GetMapping("/{postId}")
    public List<Comment> getComments(@PathVariable Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        return commentService.getCommentsForPost(post);
    }
}

