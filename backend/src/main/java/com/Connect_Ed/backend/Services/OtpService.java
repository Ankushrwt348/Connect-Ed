package com.Connect_Ed.backend.Services;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {
    private final Map<String, String> otpStore = new HashMap<>();

    public String generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpStore.put(email, otp);
        return otp;
    }

    public boolean validateOtp(String email, String inputOtp) {
        String storedOtp = otpStore.get(email);
        return storedOtp != null && storedOtp.equals(inputOtp);
    }

    public void clearOtp(String email) {
        otpStore.remove(email);
    }
}

