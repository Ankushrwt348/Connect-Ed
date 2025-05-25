package com.Connect_Ed.backend.Controller;

import com.Connect_Ed.backend.Entity.DTO.UserDto;
import com.Connect_Ed.backend.Entity.DTO.UserNetworkDto;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Repository.UserRepository;
import com.Connect_Ed.backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class UserController {

    @Autowired
    private UserService userService;


    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("user", principal.getAttributes());
    }
    @GetMapping("/api/user-info")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        // Optionally get full user info from DB based on email
        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Return user details DTO or minimal info
        UserDto userDto = UserDto.fromEntity(user);
        return ResponseEntity.ok(userDto);
    }

    private Long getCurrentUserId(OAuth2User principal) {
        String email = principal.getAttribute("email");
        if (email == null) {
            throw new RuntimeException("Email not found in OAuth2 attributes");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // Example of using it in connected users
    @GetMapping("/connected")
    public ResponseEntity<List<UserNetworkDto>> getConnected(@AuthenticationPrincipal OAuth2User principal) {
        Long userId = getCurrentUserId(principal);
        List<User> connectedUsers = userService.getConnectedUsers(userId);

        List<UserNetworkDto> dtoList = connectedUsers.stream()
                .map(UserNetworkDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<UserNetworkDto>> getRecommended(@AuthenticationPrincipal OAuth2User principal) {
        Long userId = getCurrentUserId(principal);
        List<User> recommendedUsers = userService.getRecommendedUsers(userId);

        List<UserNetworkDto> dtoList = recommendedUsers.stream()
                .map(UserNetworkDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/connect/{connectUserId}")
    public ResponseEntity<String> connectUser(@PathVariable Long connectUserId,
                                              @AuthenticationPrincipal OAuth2User principal) {
        try {
            Long userId = getCurrentUserId(principal);
            userService.connectUsers(userId, connectUserId);
            return ResponseEntity.ok("Connected successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

