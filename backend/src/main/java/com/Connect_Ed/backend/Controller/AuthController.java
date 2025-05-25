package com.Connect_Ed.backend.Controller;

import com.Connect_Ed.backend.Entity.DTO.SignDto;
import com.Connect_Ed.backend.Entity.User;
import com.Connect_Ed.backend.Entity.DTO.UserDto;
import com.Connect_Ed.backend.Entity.DTO.VerifyOtpRequest;
import com.Connect_Ed.backend.Services.AuthService;
import com.Connect_Ed.backend.Services.EmailService;
import com.Connect_Ed.backend.Services.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDto userDto) {
        // Generate and send OTP only, don't save user yet

        String otp = otpService.generateOtp(userDto.getEmail());
        emailService.sendOtpEmail(userDto.getEmail(), otp);
        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (otpService.validateOtp(request.getEmail(), request.getOtp())) {
            otpService.clearOtp(request.getEmail());
            // Now register user
            UserDto userDto = new UserDto();
            userDto.setEmail(request.getEmail());
            userDto.setFullName(request.getFullName());
            userDto.setPassword(request.getPassword());
            authService.register(userDto);
            return ResponseEntity.ok("Email verified and user registered successfully");
        } else {
            return ResponseEntity.status(400).body("Invalid OTP");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody SignDto request) {
        try {
            User user = authService.login(request);
            return ResponseEntity.ok(user); // Later replace with JWT/token
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}