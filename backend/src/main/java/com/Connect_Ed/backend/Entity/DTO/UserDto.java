package com.Connect_Ed.backend.Entity.DTO;

import com.Connect_Ed.backend.Entity.User;
import lombok.Data;

@Data
public class UserDto {
    private String fullName;
    private String email;
    private String password;
    private String profilePic;
    private Status status;

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setProfilePic(user.getProfilePic());
        dto.setStatus(user.getStatus());
        // Do not expose password in DTO
        return dto;
    }
}











