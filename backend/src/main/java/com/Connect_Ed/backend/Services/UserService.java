package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.DTO.Status;
import com.Connect_Ed.backend.Entity.DTO.UserDto;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;

    public List<User> getConnectedUsers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> connectedIds = user.getConnections().stream()
                .map(User::getId)
                .toList();

        if (connectedIds.isEmpty()) {
            return new ArrayList<>();
        }

        return userRepository.findAllByIdIn(connectedIds);
    }

    public List<User> getRecommendedUsers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> connectedIds = user.getConnections().stream()
                .map(User::getId)
                .toList();

        connectedIds.add(userId);

        return userRepository.findRecommendedUsers(userId, connectedIds);
    }

    public void connectUsers(Long userId, Long connectUserId) {
        if (userId.equals(connectUserId)) {
            throw new RuntimeException("Cannot connect to self");
        }

        User user = userRepository.findById(userId).orElseThrow();
        User connectUser = userRepository.findById(connectUserId).orElseThrow();

        user.getConnections().add(connectUser);
        connectUser.getConnections().add(user);

        userRepository.save(user);
        userRepository.save(connectUser);
    }
    public void updateUserProfile(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(userDto.getFullName());
        user.setProfilePic(userDto.getProfilePic());
        // Add other profile fields as needed
        user.setStatus(Status.PENDING_APPROVAL); // Set status to pending for admin approval

        userRepository.save(user);
    }

}
