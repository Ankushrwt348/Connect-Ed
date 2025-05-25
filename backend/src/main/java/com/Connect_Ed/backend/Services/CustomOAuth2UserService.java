package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.DTO.Role;
import com.Connect_Ed.backend.Entity.DTO.Status;
import com.Connect_Ed.backend.Entity.User;
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

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // Extract user info
        String email = oauth2User.getAttribute("email");
        String fullName = oauth2User.getAttribute("name");
        String profilePic = oauth2User.getAttribute("picture");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            // New user — register with default role and status
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setProfilePic(profilePic);
            newUser.setRole(Role.STUDENT); // default role
            newUser.setStatus(Status.PENDING_APPROVAL); // must be approved by admin

            userRepository.save(newUser);
        }

        return oauth2User;
    }

}

