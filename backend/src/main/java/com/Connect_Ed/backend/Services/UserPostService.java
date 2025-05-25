package com.Connect_Ed.backend.Services;


import com.Connect_Ed.backend.Entity.UserPost;
import com.Connect_Ed.backend.Repository.UserPostRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class UserPostService {

    private final UserPostRepository userPostRepository;

    public UserPostService(UserPostRepository userPostRepository) {
        this.userPostRepository = userPostRepository;
    }

    @Transactional
    public UserPost saveOrUpdateUser(String email, String name, String role, String profileImage) {
        Optional<UserPost> optionalUser = userPostRepository.findByEmail(email);

        UserPost user;
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            if (name != null) user.setName(name);
            if (role != null) user.setRole(role);
            if (profileImage != null) user.setProfileImage(profileImage);
        } else {
            user = new UserPost();
            user.setEmail(email);
            user.setName(name != null ? name : "Unknown User");
            user.setRole(role != null ? role : "USER");
            user.setProfileImage(profileImage != null ? profileImage : "/default-avatar.jpg");
        }
        return userPostRepository.save(user);
    }
    public Optional<UserPost> findByEmail(String email) {
        return userPostRepository.findByEmail(email);
    }



    public UserPost getOrCreateGoogleUser(Principal principal) {
        if (principal instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
            OAuth2User oAuth2User = authToken.getPrincipal();

            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String picture = oAuth2User.getAttribute("picture");

            return userPostRepository.findByEmail(email)
                    .orElseGet(() -> {
                        UserPost newUser = new UserPost();
                        newUser.setEmail(email);
                        newUser.setName(name);
                        newUser.setRole("USER");
                        newUser.setProfileImage(picture);
                        return userPostRepository.save(newUser);
                    });
        } else {
            // fallback, just try getName (but probably won't find)
            String email = principal.getName();
            return userPostRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
        }
    }

    public UserPost getOrCreateGoogleUser(OAuth2AuthenticationToken authToken) {
        OAuth2User oAuth2User = authToken.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        return userPostRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserPost newUser = new UserPost();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setRole("USER");
                    newUser.setProfileImage(picture);
                    return userPostRepository.save(newUser);
                });
    }
}
