package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.DTO.Status;
import com.Connect_Ed.backend.Entity.DTO.UserDto;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
