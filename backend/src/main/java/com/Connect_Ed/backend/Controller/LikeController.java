package com.Connect_Ed.backend.Controller;

import com.Connect_Ed.backend.Entity.Like;
import com.Connect_Ed.backend.Entity.Post;
import com.Connect_Ed.backend.Entity.UserPost;
import com.Connect_Ed.backend.Repository.PostRepository;
import com.Connect_Ed.backend.Services.LikeService;
import com.Connect_Ed.backend.Services.UserPostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LikeController {

    private final LikeService likeService;
    private final UserPostService userPostService;
    private final PostRepository postRepository;

    public LikeController(LikeService likeService, UserPostService userPostService, PostRepository postRepository) {
        this.likeService = likeService;
        this.userPostService = userPostService;
        this.postRepository = postRepository;
    }

    @PostMapping("/{postId}")
    public ResponseEntity<Like> toggleLike(@PathVariable Long postId, Principal principal) {
        UserPost user = userPostService.getOrCreateGoogleUser(principal);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        Like like = likeService.toggleLike(user, post);
        return new ResponseEntity<>(like, HttpStatus.OK); // or CREATED if you distinguish new like
    }
    @GetMapping("/count/{postId}")
    public long getLikeCount(@PathVariable Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        return likeService.getLikeCount(post);
    }


}


