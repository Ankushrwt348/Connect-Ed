package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.DTO.Role;
import com.Connect_Ed.backend.Entity.DTO.Status;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Repository.UserRepository;
import com.Connect_Ed.backend.Services.UserPostService;
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

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();

            boolean changed = false;
            if (!fullName.equals(user.getFullName())) {
                user.setFullName(fullName);
                changed = true;
            }
            if (!profilePic.equals(user.getProfilePic())) {
                user.setProfilePic(profilePic);
                changed = true;
            }
            if (changed) {
                userRepository.save(user);
            }

        } else {
            // Create new user with pending approval
            user = new User();
            user.setEmail(email);
            user.setFullName(fullName);
            user.setProfilePic(profilePic);
            user.setRole(Role.STUDENT);
            user.setStatus(Status.PENDING_APPROVAL);
            userRepository.save(user);
        }

        // ❌ Reject login if not approved
        if (user.getStatus() != Status.APPROVED) {
            throw new OAuth2AuthenticationException("Your account is pending approval by an admin.");
        }

        // ✅ Create or update UserPost record
        userPostService.saveOrUpdateUser(email, fullName, "USER", profilePic);

        return oauth2User;
    }
}
