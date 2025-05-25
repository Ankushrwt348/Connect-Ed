package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.DTO.Role;
import com.Connect_Ed.backend.Entity.DTO.Status;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Services.UserPostService;  // import UserPostService
import com.Connect_Ed.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPostService userPostService;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String fullName = oauth2User.getAttribute("name");
        String profilePic = oauth2User.getAttribute("picture");

        // Save/update main User (admin approval etc.)
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            boolean changed = false;

            if (!fullName.equals(existingUser.getFullName())) {
                existingUser.setFullName(fullName);
                changed = true;
            }
            if (!profilePic.equals(existingUser.getProfilePic())) {
                existingUser.setProfilePic(profilePic);
                changed = true;
            }
            if (changed) {
                userRepository.save(existingUser);
            }
        } else {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setProfilePic(profilePic);
            newUser.setRole(Role.STUDENT);
            newUser.setStatus(Status.PENDING_APPROVAL);
            userRepository.save(newUser);
        }

        // ✅ Also ensure UserPost exists (for posts/likes/comments)
        userPostService.saveOrUpdateUser(email, fullName, "USER", profilePic);

        return oauth2User;
    }
}
