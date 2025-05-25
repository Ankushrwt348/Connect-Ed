package com.Connect_Ed.backend.Controller;

import com.Connect_Ed.backend.Entity.Post;
import com.Connect_Ed.backend.Entity.DTO.PostRequest;
import com.Connect_Ed.backend.Entity.UserPost;
import com.Connect_Ed.backend.Services.PostService;
import com.Connect_Ed.backend.Services.UserPostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {

    private final PostService postService;
    private final UserPostService userPostService;

    public PostController(PostService postService, UserPostService userPostService) {
        this.postService = postService;
        this.userPostService = userPostService;
    }

    // ✅ Create a new post
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostRequest postRequest, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        String email;
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            email = oauth2User.getAttribute("email");
        } else {
            email = authentication.getName(); // fallback
        }

        System.out.println("✅ Extracted email: " + email);

        Optional<UserPost> optionalUser = userPostService.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with email: " + email);
        }

        UserPost user = optionalUser.get();
        System.out.println("✅ User found: " + user.getName());

        Post post = postService.createPost(user, postRequest.getContent(), postRequest.getImageUrl());
        System.out.println("✅ Post created: " + post.getContent());

        return ResponseEntity.ok(post);
    }

    // ✅ Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // ✅ Get user info by current authentication
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String email = principal.getAttribute("email");
        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not found in OAuth2User attributes");
        }

        Optional<UserPost> user = userPostService.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(user.get());
    }
}
