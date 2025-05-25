package com.Connect_Ed.backend.Services;

import com.Connect_Ed.backend.Entity.DTO.SignDto;
import com.Connect_Ed.backend.Entity.DTO.Status;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Entity.DTO.UserDto;
import com.Connect_Ed.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void register(UserDto request) {
        System.out.println("Starting registration");


        if (userRepository.existsByEmail(request.getEmail())) {
            System.out.println("Email already exists");
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set status to PENDING_APPROVAL
        user.setStatus(Status.PENDING_APPROVAL);

        System.out.println("Saving user...");
        userRepository.save(user);
        System.out.println("User saved!");
    }


    public User login(SignDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}

